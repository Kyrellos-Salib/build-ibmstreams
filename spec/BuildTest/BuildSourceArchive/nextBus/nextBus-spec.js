'use babel';

// import { expect } from 'chai';
import * as JSZip from 'jszip';
import * as fs from 'fs';


import MessageHandler from '../../../../lib/MessageHandler';

import SourceArchiveUtils from '../../../../lib/util/source-archive-utils';
import MessageHandlerRegistry from '../../../../lib/message-handler-registry';
/* eslint compat/compat: 0 */

function getFiles(dir, mainDir, folder, files_) {
  const resultFiles = files_ || [];
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    let name = `${dir}/${file}`;
    if (fs.statSync(name).isDirectory()) {
      resultFiles.push(`${name.replace(mainDir, folder)}/`);
      getFiles(name, mainDir, folder, files_);
    } else if (file.match(/.build_.*zip/) === null) {
      name = name.replace(mainDir, folder);
      resultFiles.push(name);
    }
  });
  return resultFiles;
}
describe('build', () => {
  const expectedOutput = `${__dirname}\\splFiles\\.build_NextBusIngest_1000.zip`;
  let files;
  const toolkitsPath = `${__dirname}\\..\\toolkits`;
  describe('create', () => {
    let messageHandler;
    let fqn;
    const appRoot = `${__dirname}\\splFiles`;
    let buildSourceArchiveOutput;
    beforeEach(async () => {
      messageHandler = new MessageHandler(console);
      fqn = 'NextBusIngest';
      MessageHandlerRegistry.add(fqn, messageHandler);
      buildSourceArchiveOutput = await SourceArchiveUtils.buildSourceArchive(
        {
          appRoot,
          toolkitPathSetting: toolkitsPath,
          fqn,
          messageHandler
        }
      );
    });
    it('Builds a Source Archive for nextBus', () => {
      waitsFor(() => SourceArchiveUtils.checkArchiveDone(), 10000);
      expect(buildSourceArchiveOutput.archivePath).toEqual(expectedOutput);
    });
  });
  describe('content', async () => {
    const readFilePromise = (fileName) => {
      return new Promise((resolve, reject) => {
        fs.readFile(fileName, (err, data) => {
          resolve(data);
        });
      });
    };
    let expectedFiles = getFiles(`${__dirname}/splFiles`, `${__dirname}/splFiles`, 'splFiles');
    expectedFiles.push('Makefile');
    expectedFiles.push('splFiles/Makefile');
    expectedFiles = getFiles(`${toolkitsPath}/com.ibm.streamsx.inet`, `${toolkitsPath}`, 'toolkits', expectedFiles);
    beforeEach(async () => {
      const file = await readFilePromise(expectedOutput);
      const zip = await JSZip.loadAsync(file, { base64: true });
      files = Object.keys(zip.files);
    });

    it('checks if the right content is inside', () => {
      fs.unlinkSync(expectedOutput);
      files.sort();
      expectedFiles.sort();
      expect(files).toEqual(expectedFiles);
    });
  });
});
