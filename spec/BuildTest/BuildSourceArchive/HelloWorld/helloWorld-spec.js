'use babel';

// import { expect } from 'chai';
import * as JSZip from 'jszip';
import * as fs from 'fs';

import MessageHandler from '../../../../lib/MessageHandler';

import SourceArchiveUtils from '../../../../lib/util/source-archive-utils';
import MessageHandlerRegistry from '../../../../lib/message-handler-registry';
/* eslint compat/compat: 0 */

describe('build', async () => {
  const expectedOutput = `${__dirname}\\splFiles\\.build_HelloWorld_1000.zip`;
  let files;
  describe('create', async () => {
    let messageHandler;
    let fqn;
    let buildSourceArchiveOutput;
    const appRoot = `${__dirname}\\splFiles`;
    const toolkitsPath = '../toolkits';
    beforeEach(async () => {
      messageHandler = new MessageHandler(console);
      fqn = 'HelloWorld';
      MessageHandlerRegistry.add(fqn, messageHandler);
      buildSourceArchiveOutput = await SourceArchiveUtils.buildSourceArchive(
        {
          appRoot,
          toolkitPathSetting: toolkitsPath,
          fqn
        }
      );
    });

    it('Build Source Archive for Hello World', async () => {
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

    beforeEach(async () => {
      const file = await readFilePromise(expectedOutput);
      const zip = await JSZip.loadAsync(file);
      files = Object.keys(zip.files);
    });

    it('checks if the right content is inside', () => {
      fs.unlinkSync(expectedOutput);
      expect(files).toEqual(['Makefile', 'HelloWorld.spl']);
    });
  });
});
