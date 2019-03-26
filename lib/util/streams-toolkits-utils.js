'use babel';
'use strict';

import * as fs from 'fs';
import * as path from 'path';
import * as _ from 'underscore';
// import { DidChangeConfigurationNotification } from 'vscode-languageserver-protocol';
import * as xmldoc from 'xmldoc';
// import { SplConfig } from '../../index';
import StateSelector from './state-selectors';

function refreshToolkits(state) {
  // const client = SplConfig.getLanguageClient();

  const clearParam = getLangServerParamForClearToolkits();
  // client.sendNotification(DidChangeConfigurationNotification.type, clearParam);

  const addParam = getLangServerParamForAddToolkits([
    ...getCachedToolkitIndexPaths(StateSelector.getToolkitsCacheDir(state)),
    ...getLocalToolkitIndexPaths(StateSelector.getToolkitsPathSetting(state))
  ]);
  console.log('toolkitRefresh: clearParam', clearParam);
  console.log('toolkitRefresh: addParam', addParam);
  // client.sendNotification(DidChangeConfigurationNotification.type, addParam);
}

function getLangServerOptionForInitToolkits(toolkitsCacheDir, toolkitsPathSetting) {
  return {
    toolkits: {
      action: 'INIT',
      indexList: [
        ...getCachedToolkitIndexPaths(toolkitsCacheDir),
        ...getLocalToolkitIndexPaths(toolkitsPathSetting)
      ]
    }
  };
}

function getLangServerParamForAddToolkits(toolkitIndexPaths) {
  return {
    settings: {
      toolkits: {
        action: 'ADD',
        indexList: toolkitIndexPaths
      }
    }
  };
}

function getLangServerParamForRemoveToolkits(toolkitNames) {
  return {
    settings: {
      toolkits: {
        action: 'REMOVE',
        names: toolkitNames
      }
    }
  };
}

function getLangServerParamForClearToolkits() {
  return {
    settings: {
      toolkits: {
        action: 'CLEAR'
      }
    }
  };
}

function getCachedToolkitIndexPaths(toolkitsCacheDir) {
  try {
    const filenames = fs.readdirSync(toolkitsCacheDir).filter(entry => typeof entry === 'string' && path.extname(entry) === '.xml');
    return filenames.map(filename => `${toolkitsCacheDir}${path.sep}${filename}`);
  } catch (err) {
    throw new Error(`Error getting cached toolkit index paths in: ${toolkitsCacheDir}\n${err}`);
  }
}

function getLocalToolkitIndexPaths(toolkitPaths) {
  try {
    const validToolkitIndexPaths = [];
    if (toolkitPaths && toolkitPaths !== '') {
      const toolkitRoots = [];

      if (toolkitPaths.includes(',') || toolkitPaths.includes(';')) {
        toolkitRoots.push(...toolkitPaths.split(/[,;]/));
      } else {
        toolkitRoots.push(toolkitPaths);
      }

      toolkitRoots.forEach(toolkitRoot => {
        if (fs.existsSync(toolkitRoot)) {
          const toolkitRootContents = fs.readdirSync(toolkitRoot);
          validToolkitIndexPaths.push(...toolkitRootContents
            .filter(item => fs.lstatSync(`${toolkitRoot}${path.sep}${item}`).isDirectory())
            .filter(dir => fs.readdirSync(`${toolkitRoot}${path.sep}${dir}`).filter(tkDirItem => tkDirItem === 'toolkit.xml').length > 0)
            .map(toolkit => `${toolkitRoot}${path.sep}${toolkit}${path.sep}toolkit.xml`));
        }
      });
    }
    return validToolkitIndexPaths;
  } catch (err) {
    throw new Error(`Error getting local toolkit index paths for: ${toolkitPaths}\n${err}`);
  }
}

function getChangedLocalToolkits(oldValue, newValue) {
  const oldIndexPaths = getLocalToolkitIndexPaths(oldValue);
  const newIndexPaths = getLocalToolkitIndexPaths(newValue);
  const addedToolkitPaths = _.difference(newIndexPaths, oldIndexPaths);
  const removedToolkitPaths = _.difference(oldIndexPaths, newIndexPaths);
  const removedToolkitNames = [];
  removedToolkitPaths.forEach(tkPath => {
    try {
      const xml = fs.readFileSync(tkPath, 'utf8');
      const document = new xmldoc.XmlDocument(xml);
      const toolkitName = document.childNamed('toolkit').attr.name;
      removedToolkitNames.push(toolkitName);
    } catch (err) {
      throw new Error(`Error reading local toolkit index contents for: ${tkPath}\n${err}`);
    }
  });

  return { addedToolkitPaths, removedToolkitNames };
}

function cacheToolkitIndex(state, toolkit) {
  const { name, version, index } = toolkit;
  const cacheDir = StateSelector.getToolkitsCacheDir(state);
  if (!cacheDir) {
    throw new Error('toolkit cache directory does not exist');
  }
  console.log('in cacheToolkitIndex:', state, toolkit, cacheDir);
  try {
    fs.writeFileSync(`${cacheDir}${path.sep}${name}-${version}.xml`, index);
  } catch (err) {
    throw new Error(`Error caching toolkit index for: ${name}\n${err}`);
  }
}

const StreamsToolkitsUtils = {
  refreshToolkits,
  getLangServerOptionForInitToolkits,
  getLangServerParamForAddToolkits,
  getLangServerParamForRemoveToolkits,
  getLangServerParamForClearToolkits,
  getCachedToolkitIndexPaths,
  getLocalToolkitIndexPaths,
  getChangedLocalToolkits,
  cacheToolkitIndex
};

export default StreamsToolkitsUtils;
