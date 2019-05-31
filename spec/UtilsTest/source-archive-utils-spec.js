'use babel';

// import { expect } from 'chai';


import MessageHandler from '../../lib/MessageHandler';

import SourceArchiveUtils from '../../lib/util/source-archive-utils';
import MessageHandlerRegistry from '../../lib/message-handler-registry';


describe('source-archive-utils', () => {
  const toolkitsPath = `${__dirname}\\..\\BuildTest\\BuildSourceArchive\\toolkits`;
  const appRoot = `${__dirname}\\splFiles`;
  describe('getToolkits()', () => {
    const toolkits = SourceArchiveUtils.getToolkits(undefined, toolkitsPath, appRoot);
    const expectedOutput = [{ name: 'com.ibm.streamsx.inet', tkPath: `${toolkitsPath}\\com.ibm.streamsx.inet` }];
    it('gets all local toolkits specified inside the info.xml file', () => {
      expect(toolkits).toEqual(expectedOutput);
    });
  });
  describe('observableBuildSourceArchive()', () => {
    const fqn = 'HelloWorld';
    let observableArchive;
    let messageHandler;
    const expectedPath = `${__dirname}\\splFiles\\.build_HelloWorld_1000.zip`;
    const expectedOutput = {
      type: 'SOURCE_ARCHIVE_CREATED',
      archivePath: expectedPath,
      buildId: undefined
    };
    beforeEach(async () => {
      messageHandler = new MessageHandler(console);
      MessageHandlerRegistry.add(fqn, messageHandler);
      observableArchive = await SourceArchiveUtils.buildSourceArchive(
        {
          appRoot,
          toolkitPathSetting: toolkitsPath,
          fqn,
          messageHandler
        }
      );
    });
    it('tests the observableBuildSourceArchive() function', () => {
      expect(observableArchive).toEqual(expectedOutput);
    });
  });
  describe('getApplicationRoot()', () => {
    const projectPaths = [__dirname];
    const selectedFile = `${__dirname}\\splFiles\\HelloWorld.spl`;
    let appRootT;
    const expectedOutput = `${__dirname}\\splFiles`;
    beforeEach(() => {
      appRootT = SourceArchiveUtils.getApplicationRoot(projectPaths, selectedFile);
    });
    it('gets the application root path', () => {
      expect(appRootT).toEqual(expectedOutput);
    });
  });
});
