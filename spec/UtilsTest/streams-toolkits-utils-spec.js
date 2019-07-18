'use babel';

import * as path from 'path';
import * as fs from 'fs';
import StreamsToolkitsUtils from '../../lib/util/streams-toolkits-utils';

describe('Streams-toolkit-utils functions', () => {
  let indexPath;
  let expectedOutputLocalToolkits;
  let expectedOutputCachedToolkits;
  describe('getLocalToolkitIndexPaths() 1', () => {
    const toolkitsPathSetting = `${__dirname}${path.sep}..${path.sep}BuildTest${path.sep}BuildSourceArchive${path.sep}toolkits${path.sep}streamsx.inet-2.9.6`;
    beforeEach(() => {
      indexPath = StreamsToolkitsUtils.getLocalToolkitIndexPaths(toolkitsPathSetting);
    });
    const expectedOutput = [`${__dirname}${path.sep}..${path.sep}BuildTest${path.sep}BuildSourceArchive${path.sep}toolkits${path.sep}streamsx.inet-2.9.6${path.sep}com.ibm.streamsx.inet${path.sep}toolkit.xml`];
    it('tests the getLocalToolkitsIndexPath function\'s output with 1 local toolkit', () => {
      expect(indexPath).toEqual(expectedOutput);
    });
  });
  describe('getLocalToolkitIndexPaths() 2', () => {
    const toolkitsPathSetting = `${__dirname}${path.sep}toolkits${path.sep}streamsx.inet-2.9.6`;
    beforeEach(() => {
      indexPath = StreamsToolkitsUtils.getLocalToolkitIndexPaths(toolkitsPathSetting);
    });
    const expectedOutput = [`${__dirname}${path.sep}toolkits${path.sep}streamsx.inet-2.9.6${path.sep}com.ibm.streamsx.inet${path.sep}toolkit.xml`, `${__dirname}${path.sep}toolkits${path.sep}streamsx.inet-2.9.6${path.sep}com.ibm.streamsx.inet2${path.sep}toolkit.xml`];
    it('tests the getLocalToolkitsIndexPath function\'s output with more than 1 local toolkit', () => {
      expect(indexPath).toEqual(expectedOutput);
    });
  });
  describe('getChangedLocalToolkits() 1', () => {
    const oldPaths = `${__dirname}${path.sep}..${path.sep}BuildTest${path.sep}BuildSourceArchive${path.sep}toolkits${path.sep}streamsx.inet-2.9.6`;
    const newPaths = `${__dirname}${path.sep}toolkits${path.sep}streamsx.inet-2.9.6`;
    let toolkits;
    beforeEach(() => {
      toolkits = StreamsToolkitsUtils.getChangedLocalToolkits(oldPaths, newPaths);
    });
    const expectedOutput = { addedToolkitPaths: [`${__dirname}${path.sep}toolkits${path.sep}streamsx.inet-2.9.6${path.sep}com.ibm.streamsx.inet${path.sep}toolkit.xml`, `${__dirname}${path.sep}toolkits${path.sep}streamsx.inet-2.9.6${path.sep}com.ibm.streamsx.inet2${path.sep}toolkit.xml`], removedToolkitNames: ['com.ibm.streamsx.inet'] };
    it('tests the getChangedLocalToolkits functions\' output', () => {
      expect(toolkits).toEqual(expectedOutput);
    });
  });
  describe('getChangedLocalToolkits() 2', () => {
    const newPaths = `${__dirname}${path.sep}..${path.sep}BuildTest${path.sep}BuildSourceArchive${path.sep}toolkits${path.sep}streamsx.inet-2.9.6`;
    const oldPaths = `${__dirname}${path.sep}toolkits${path.sep}streamsx.inet-2.9.6`;
    let toolkits;
    beforeEach(() => {
      toolkits = StreamsToolkitsUtils.getChangedLocalToolkits(oldPaths, newPaths);
    });
    const expectedOutput = { addedToolkitPaths: [`${__dirname}${path.sep}..${path.sep}BuildTest${path.sep}BuildSourceArchive${path.sep}toolkits${path.sep}streamsx.inet-2.9.6${path.sep}com.ibm.streamsx.inet${path.sep}toolkit.xml`], removedToolkitNames: ['com.ibm.streamsx.inet', 'com.ibm.streamsx.inet2'] };
    it('tests the getChangedLocalToolkits functions\' output', () => {
      expect(toolkits).toEqual(expectedOutput);
    });
  });
  describe('getLocalToolkits()', () => {
    const toolkitsPaths = `${__dirname}${path.sep}toolkits${path.sep}streamsx.inet-2.9.6`;
    let toolkits;
    beforeEach(() => {
      toolkits = StreamsToolkitsUtils.getLocalToolkits(toolkitsPaths);
    });
    expectedOutputLocalToolkits = [{
      name: 'com.ibm.streamsx.inet', version: '2.9.6', indexPath: `${__dirname}${path.sep}toolkits${path.sep}streamsx.inet-2.9.6${path.sep}com.ibm.streamsx.inet${path.sep}toolkit.xml`, label: 'com.ibm.streamsx.inet - 2.9.6', isLocal: true
    }, {
      name: 'com.ibm.streamsx.inet2', version: '2.9.6', indexPath: `${__dirname}${path.sep}toolkits${path.sep}streamsx.inet-2.9.6${path.sep}com.ibm.streamsx.inet2${path.sep}toolkit.xml`, label: 'com.ibm.streamsx.inet2 - 2.9.6', isLocal: true
    }];
    it('tests the getLocalToolkits function\'s output', () => {
      expect(toolkits).toEqual(expectedOutputLocalToolkits);
    });
  });
  // describe('filterNewestToolkits()', () => {
  //   const toolkits = [{
  //     name: 'com.ibm.streamsx.inet', version: '2.9.6', indexPath: `${__dirname}${path.sep}toolkits${path.sep}com.ibm.streamsx.inet${path.sep}toolkit.xml`, label: 'com.ibm.streamsx.inet - 2.9.6', isLocal: true
  //   }, {
  //     name: 'com.ibm.streamsx.inet', version: '3.0.0', indexPath: `${__dirname}${path.sep}toolkits${path.sep}com.ibm.streamsx.inet2${path.sep}toolkit.xml`, label: 'com.ibm.streamsx.inet - 2.9.7', isLocal: true
  //   }, {
  //     name: 'com.ibm.streamsx.inet2', version: '2.9.7', indexPath: `${__dirname}${path.sep}toolkits${path.sep}com.ibm.streamsx.inet2${path.sep}toolkit.xml`, label: 'com.ibm.streamsx.inet2 - 2.9.7', isLocal: true
  //   }];
  //   let output;
  //   beforeEach(() => {
  //     output = StreamsToolkitsUtils.filterNewestToolkits(toolkits);
  //   });
  //   const expectedOutput = [{
  //     name: 'com.ibm.streamsx.inet', version: '3.0.0', indexPath: `${__dirname}${path.sep}toolkits${path.sep}com.ibm.streamsx.inet2${path.sep}toolkit.xml`, label: 'com.ibm.streamsx.inet - 2.9.7', isLocal: true
  //   }, {
  //     name: 'com.ibm.streamsx.inet2', version: '2.9.7', indexPath: `${__dirname}${path.sep}toolkits${path.sep}com.ibm.streamsx.inet2${path.sep}toolkit.xml`, label: 'com.ibm.streamsx.inet2 - 2.9.7', isLocal: true
  //   }];
  //   it('tests the getLocalToolkits function\'s output', () => {
  //     expect(output).toEqual(expectedOutput);
  //   });
  // });
  describe('getCachedToolkits()', () => {
    let cachedToolkits;
    beforeEach(() => {
      cachedToolkits = StreamsToolkitsUtils.getCachedToolkits(`${__dirname}${path.sep}..${path.sep}..${path.sep}toolkitsCache`).map(tk => {
        const file = tk.indexPath.replace(`${__dirname}${path.sep}..${path.sep}..${path.sep}toolkitsCache${path.sep}`, '');
        return file;
      });
    });
    expectedOutputCachedToolkits = fs.readdirSync(`${__dirname}${path.sep}..${path.sep}..${path.sep}toolkitsCache`);
    it('tests the getCachedToolkits function\'s output', () => {
      expect(cachedToolkits).toEqual(expectedOutputCachedToolkits);
    });
  });
  describe('getCachedToolkitIndexPaths()', () => {
    let cachedToolkitsIndex;
    beforeEach(() => {
      cachedToolkitsIndex = StreamsToolkitsUtils.getCachedToolkitIndexPaths(`${__dirname}${path.sep}..${path.sep}..${path.sep}toolkitsCache`);
    });
    const expectedOutput = expectedOutputCachedToolkits.map(file => `${__dirname}${path.sep}..${path.sep}..${path.sep}toolkitsCache${path.sep}${file}`);
    it('tests the getCachedToolkitIndexPaths function\'s output', () => {
      expect(cachedToolkitsIndex).toEqual(expectedOutput);
    });
  });
  describe('getAllToolkits()', () => {
    let toolkits;
    beforeEach(() => {
      toolkits = StreamsToolkitsUtils.getAllToolkits(`${__dirname}${path.sep}..${path.sep}..${path.sep}toolkitsCache`, `${__dirname}${path.sep}toolkits${path.sep}streamsx.inet-2.9.6`).map(tk => {
        const file = tk.indexPath.replace(`${__dirname}${path.sep}..${path.sep}..${path.sep}toolkitsCache${path.sep}`, '');
        return file;
      });
    });
    const expectedIndexLocalToolkits = expectedOutputLocalToolkits.map(tk => tk.indexPath);
    const expectedOutput = expectedOutputCachedToolkits.concat(expectedIndexLocalToolkits);
    it('tests the getAllToolkits function\'s output', () => {
      expect(toolkits).toEqual(expectedOutput);
    });
  });
});
