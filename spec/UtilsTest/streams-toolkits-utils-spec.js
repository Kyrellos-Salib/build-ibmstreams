'use babel';

import StreamsToolkitsUtils from '../../lib/util/streams-toolkits-utils';

describe('Streams-toolkit-utils functions', () => {
  let indexPath;
  let expectedOutputLocalToolkis;
  let expectedOutputCachedToolkits;
  describe('getLocalToolkitIndexPaths() 1', () => {
    const toolkitsPathSetting = `${__dirname}\\..\\BuildTest\\BuildSourceArchive\\toolkits`;
    beforeEach(() => {
      indexPath = StreamsToolkitsUtils.getLocalToolkitIndexPaths(toolkitsPathSetting);
    });
    const expectedOutput = [`${__dirname}\\..\\BuildTest\\BuildSourceArchive\\toolkits\\com.ibm.streamsx.inet\\toolkit.xml`];
    it('tests the getLocalToolkitsIndexPath function\'s output with 1 local toolkit', () => {
      expect(indexPath).toEqual(expectedOutput);
    });
  });
  describe('getLocalToolkitIndexPaths() 2', () => {
    const toolkitsPathSetting = `${__dirname}\\toolkits`;
    beforeEach(() => {
      indexPath = StreamsToolkitsUtils.getLocalToolkitIndexPaths(toolkitsPathSetting);
    });
    const expectedOutput = [`${__dirname}\\toolkits\\com.ibm.streamsx.inet\\toolkit.xml`, `${__dirname}\\toolkits\\com.ibm.streamsx.inet2\\toolkit.xml`];
    it('tests the getLocalToolkitsIndexPath function\'s output with more than 1 local toolkit', () => {
      expect(indexPath).toEqual(expectedOutput);
    });
  });
  describe('getChangedLocalToolkits() 1', () => {
    const oldPaths = `${__dirname}\\..\\BuildTest\\BuildSourceArchive\\toolkits`;
    const newPaths = `${__dirname}\\toolkits`;
    let toolkits;
    beforeEach(() => {
      toolkits = StreamsToolkitsUtils.getChangedLocalToolkits(oldPaths, newPaths);
    });
    const expectedOutput = { addedToolkitPaths: [`${__dirname}\\toolkits\\com.ibm.streamsx.inet\\toolkit.xml`, `${__dirname}\\toolkits\\com.ibm.streamsx.inet2\\toolkit.xml`], removedToolkitNames: ['com.ibm.streamsx.inet'] };
    it('tests the getChangedLocalToolkits functions\' output', () => {
      expect(toolkits).toEqual(expectedOutput);
    });
  });
  describe('getChangedLocalToolkits() 2', () => {
    const newPaths = `${__dirname}\\..\\BuildTest\\BuildSourceArchive\\toolkits`;
    const oldPaths = `${__dirname}\\toolkits`;
    let toolkits;
    beforeEach(() => {
      toolkits = StreamsToolkitsUtils.getChangedLocalToolkits(oldPaths, newPaths);
    });
    const expectedOutput = { addedToolkitPaths: [`${__dirname}\\..\\BuildTest\\BuildSourceArchive\\toolkits\\com.ibm.streamsx.inet\\toolkit.xml`], removedToolkitNames: ['com.ibm.streamsx.inet', 'com.ibm.streamsx.inet2'] };
    it('tests the getChangedLocalToolkits functions\' output', () => {
      expect(toolkits).toEqual(expectedOutput);
    });
  });
  describe('getLocalToolkits()', () => {
    const toolkitsPaths = `${__dirname}\\toolkits`;
    let toolkits;
    beforeEach(() => {
      toolkits = StreamsToolkitsUtils.getLocalToolkits(toolkitsPaths);
    });
    expectedOutputLocalToolkis = [{
      name: 'com.ibm.streamsx.inet', version: '2.9.6', indexPath: `${__dirname}\\toolkits\\com.ibm.streamsx.inet\\toolkit.xml`, label: 'com.ibm.streamsx.inet - 2.9.6', isLocal: true
    }, {
      name: 'com.ibm.streamsx.inet2', version: '2.9.6', indexPath: `${__dirname}\\toolkits\\com.ibm.streamsx.inet2\\toolkit.xml`, label: 'com.ibm.streamsx.inet2 - 2.9.6', isLocal: true
    }];
    it('tests the getLocalToolkits function\'s output', () => {
      expect(toolkits).toEqual(expectedOutputLocalToolkis);
    });
  });
  // describe('filterNewestToolkits()', () => {
  //   const toolkits = [{
  //     name: 'com.ibm.streamsx.inet', version: '2.9.6', indexPath: `${__dirname}\\toolkits\\com.ibm.streamsx.inet\\toolkit.xml`, label: 'com.ibm.streamsx.inet - 2.9.6', isLocal: true
  //   }, {
  //     name: 'com.ibm.streamsx.inet', version: '3.0.0', indexPath: `${__dirname}\\toolkits\\com.ibm.streamsx.inet2\\toolkit.xml`, label: 'com.ibm.streamsx.inet - 2.9.7', isLocal: true
  //   }, {
  //     name: 'com.ibm.streamsx.inet2', version: '2.9.7', indexPath: `${__dirname}\\toolkits\\com.ibm.streamsx.inet2\\toolkit.xml`, label: 'com.ibm.streamsx.inet2 - 2.9.7', isLocal: true
  //   }];
  //   let output;
  //   beforeEach(() => {
  //     output = StreamsToolkitsUtils.filterNewestToolkits(toolkits);
  //   });
  //   const expectedOutput = [{
  //     name: 'com.ibm.streamsx.inet', version: '3.0.0', indexPath: `${__dirname}\\toolkits\\com.ibm.streamsx.inet2\\toolkit.xml`, label: 'com.ibm.streamsx.inet - 2.9.7', isLocal: true
  //   }, {
  //     name: 'com.ibm.streamsx.inet2', version: '2.9.7', indexPath: `${__dirname}\\toolkits\\com.ibm.streamsx.inet2\\toolkit.xml`, label: 'com.ibm.streamsx.inet2 - 2.9.7', isLocal: true
  //   }];
  //   it('tests the getLocalToolkits function\'s output', () => {
  //     expect(output).toEqual(expectedOutput);
  //   });
  // });
  describe('getCachedToolkits()', () => {
    let cachedToolkits;
    beforeEach(() => {
      cachedToolkits = StreamsToolkitsUtils.getCachedToolkits(`${__dirname}\\..\\..\\toolkitsCache`);
    });
    expectedOutputCachedToolkits = [{
      name: 'com.ibm.streams.cep', version: '2.1.1', indexPath: `${__dirname}\\..\\..\\toolkitsCache\\com.ibm.streams.cep-2.1.1.xml`, label: 'com.ibm.streams.cep - 2.1.1', isLocal: false
    }, {
      name: 'com.ibm.streams.cybersecurity', version: '2.1.1', indexPath: `${__dirname}\\..\\..\\toolkitsCache\\com.ibm.streams.cybersecurity-2.1.1.xml`, label: 'com.ibm.streams.cybersecurity - 2.1.1', isLocal: false
    }, {
      name: 'com.ibm.streams.geospatial', version: '3.3.1', indexPath: `${__dirname}\\..\\..\\toolkitsCache\\com.ibm.streams.geospatial-3.3.1.xml`, label: 'com.ibm.streams.geospatial - 3.3.1', isLocal: false
    }, {
      name: 'com.ibm.streams.pmml', version: '1.1.0', indexPath: `${__dirname}\\..\\..\\toolkitsCache\\com.ibm.streams.pmml-1.1.0.xml`, label: 'com.ibm.streams.pmml - 1.1.0', isLocal: false
    }, {
      name: 'com.ibm.streams.rproject', version: '2.1.2', indexPath: `${__dirname}\\..\\..\\toolkitsCache\\com.ibm.streams.rproject-2.1.2.xml`, label: 'com.ibm.streams.rproject - 2.1.2', isLocal: false
    }, {
      name: 'com.ibm.streams.rules', version: '2.1.2', indexPath: `${__dirname}\\..\\..\\toolkitsCache\\com.ibm.streams.rules-2.1.2.xml`, label: 'com.ibm.streams.rules - 2.1.2', isLocal: false
    }, {
      name: 'com.ibm.streams.rulescompiler', version: '1.2.16', indexPath: `${__dirname}\\..\\..\\toolkitsCache\\com.ibm.streams.rulescompiler-1.2.16.xml`, label: 'com.ibm.streams.rulescompiler - 1.2.16', isLocal: false
    }, {
      name: 'com.ibm.streams.teda', version: '2.2.1', indexPath: `${__dirname}\\..\\..\\toolkitsCache\\com.ibm.streams.teda-2.2.1.xml`, label: 'com.ibm.streams.teda - 2.2.1', isLocal: false
    }, {
      name: 'com.ibm.streams.text', version: '2.3.2', indexPath: `${__dirname}\\..\\..\\toolkitsCache\\com.ibm.streams.text-2.3.2.xml`, label: 'com.ibm.streams.text - 2.3.2', isLocal: false
    }, {
      name: 'com.ibm.streams.timeseries', version: '5.0.1', indexPath: `${__dirname}\\..\\..\\toolkitsCache\\com.ibm.streams.timeseries-5.0.1.xml`, label: 'com.ibm.streams.timeseries - 5.0.1', isLocal: false
    }, {
      name: 'com.ibm.streamsx.avro', version: '1.2.1', indexPath: `${__dirname}\\..\\..\\toolkitsCache\\com.ibm.streamsx.avro-1.2.1.xml`, label: 'com.ibm.streamsx.avro - 1.2.1', isLocal: false
    }, {
      name: 'com.ibm.streamsx.datetime', version: '1.2.1', indexPath: `${__dirname}\\..\\..\\toolkitsCache\\com.ibm.streamsx.datetime-1.2.1.xml`, label: 'com.ibm.streamsx.datetime - 1.2.1', isLocal: false
    }, {
      name: 'com.ibm.streamsx.dps', version: '3.3.3', indexPath: `${__dirname}\\..\\..\\toolkitsCache\\com.ibm.streamsx.dps-3.3.3.xml`, label: 'com.ibm.streamsx.dps - 3.3.3', isLocal: false
    }, {
      name: 'com.ibm.streamsx.elasticsearch', version: '2.1.1', indexPath: `${__dirname}\\..\\..\\toolkitsCache\\com.ibm.streamsx.elasticsearch-2.1.1.xml`, label: 'com.ibm.streamsx.elasticsearch - 2.1.1', isLocal: false
    }, {
      name: 'com.ibm.streamsx.hbase', version: '3.3.0', indexPath: `${__dirname}\\..\\..\\toolkitsCache\\com.ibm.streamsx.hbase-3.3.0.xml`, label: 'com.ibm.streamsx.hbase - 3.3.0', isLocal: false
    }, {
      name: 'com.ibm.streamsx.hdfs', version: '4.3.0', indexPath: `${__dirname}\\..\\..\\toolkitsCache\\com.ibm.streamsx.hdfs-4.3.0.xml`, label: 'com.ibm.streamsx.hdfs - 4.3.0', isLocal: false
    }, {
      name: 'com.ibm.streamsx.inet', version: '3.0.0', indexPath: `${__dirname}\\..\\..\\toolkitsCache\\com.ibm.streamsx.inet-3.0.0.xml`, label: 'com.ibm.streamsx.inet - 3.0.0', isLocal: false
    }, {
      name: 'com.ibm.streamsx.iot', version: '1.2.0', indexPath: `${__dirname}\\..\\..\\toolkitsCache\\com.ibm.streamsx.iot-1.2.0.xml`, label: 'com.ibm.streamsx.iot - 1.2.0', isLocal: false
    }, {
      name: 'com.ibm.streamsx.jdbc', version: '1.4.3', indexPath: `${__dirname}\\..\\..\\toolkitsCache\\com.ibm.streamsx.jdbc-1.4.3.xml`, label: 'com.ibm.streamsx.jdbc - 1.4.3', isLocal: false
    }, {
      name: 'com.ibm.streamsx.json', version: '1.5.1', indexPath: `${__dirname}\\..\\..\\toolkitsCache\\com.ibm.streamsx.json-1.5.1.xml`, label: 'com.ibm.streamsx.json - 1.5.1', isLocal: false
    }, {
      name: 'com.ibm.streamsx.kafka', version: '1.7.3', indexPath: `${__dirname}\\..\\..\\toolkitsCache\\com.ibm.streamsx.kafka-1.7.3.xml`, label: 'com.ibm.streamsx.kafka - 1.7.3', isLocal: false
    }, {
      name: 'com.ibm.streamsx.messagehub', version: '1.7.4', indexPath: `${__dirname}\\..\\..\\toolkitsCache\\com.ibm.streamsx.messagehub-1.7.4.xml`, label: 'com.ibm.streamsx.messagehub - 1.7.4', isLocal: false
    }, {
      name: 'com.ibm.streamsx.messaging', version: '5.3.12', indexPath: `${__dirname}\\..\\..\\toolkitsCache\\com.ibm.streamsx.messaging-5.3.12.xml`, label: 'com.ibm.streamsx.messaging - 5.3.12', isLocal: false
    }, {
      name: 'com.ibm.streamsx.mqtt', version: '1.0.0', indexPath: `${__dirname}\\..\\..\\toolkitsCache\\com.ibm.streamsx.mqtt-1.0.0.xml`, label: 'com.ibm.streamsx.mqtt - 1.0.0', isLocal: false
    }, {
      name: 'com.ibm.streamsx.network', version: '3.1.0', indexPath: `${__dirname}\\..\\..\\toolkitsCache\\com.ibm.streamsx.network-3.1.0.xml`, label: 'com.ibm.streamsx.network - 3.1.0', isLocal: false
    }, {
      name: 'com.ibm.streamsx.objectstorage', version: '1.9.1', indexPath: `${__dirname}\\..\\..\\toolkitsCache\\com.ibm.streamsx.objectstorage-1.9.1.xml`, label: 'com.ibm.streamsx.objectstorage - 1.9.1', isLocal: false
    }, {
      name: 'com.ibm.streamsx.rabbitmq', version: '1.2.1', indexPath: `${__dirname}\\..\\..\\toolkitsCache\\com.ibm.streamsx.rabbitmq-1.2.1.xml`, label: 'com.ibm.streamsx.rabbitmq - 1.2.1', isLocal: false
    }, {
      name: 'com.ibm.streamsx.sparkmllib', version: '1.1.1', indexPath: `${__dirname}\\..\\..\\toolkitsCache\\com.ibm.streamsx.sparkmllib-1.1.1.xml`, label: 'com.ibm.streamsx.sparkmllib - 1.1.1', isLocal: false
    }, {
      name: 'com.ibm.streamsx.topology', version: '1.11.10', indexPath: `${__dirname}\\..\\..\\toolkitsCache\\com.ibm.streamsx.topology-1.11.10.xml`, label: 'com.ibm.streamsx.topology - 1.11.10', isLocal: false
    }, {
      name: 'spl', version: '1.4.0', indexPath: `${__dirname}\\..\\..\\toolkitsCache\\spl-1.4.0.xml`, label: 'spl - 1.4.0', isLocal: false
    }];
    it('tests the getCachedToolkits function\'s output', () => {
      expect(cachedToolkits).toEqual(expectedOutputCachedToolkits);
    });
  });
  describe('getCachedToolkitIndexPaths()', () => {
    let cachedToolkitsIndex;
    beforeEach(() => {
      cachedToolkitsIndex = StreamsToolkitsUtils.getCachedToolkitIndexPaths(`${__dirname}\\..\\..\\toolkitsCache`);
    });
    const expectedOutput = [`${__dirname}\\..\\..\\toolkitsCache\\com.ibm.streams.cep-2.1.1.xml`,
      `${__dirname}\\..\\..\\toolkitsCache\\com.ibm.streams.cybersecurity-2.1.1.xml`,
      `${__dirname}\\..\\..\\toolkitsCache\\com.ibm.streams.geospatial-3.3.1.xml`,
      `${__dirname}\\..\\..\\toolkitsCache\\com.ibm.streams.pmml-1.1.0.xml`,
      `${__dirname}\\..\\..\\toolkitsCache\\com.ibm.streams.rproject-2.1.2.xml`,
      `${__dirname}\\..\\..\\toolkitsCache\\com.ibm.streams.rules-2.1.2.xml`,
      `${__dirname}\\..\\..\\toolkitsCache\\com.ibm.streams.rulescompiler-1.2.16.xml`,
      `${__dirname}\\..\\..\\toolkitsCache\\com.ibm.streams.teda-2.2.1.xml`,
      `${__dirname}\\..\\..\\toolkitsCache\\com.ibm.streams.text-2.3.2.xml`,
      `${__dirname}\\..\\..\\toolkitsCache\\com.ibm.streams.timeseries-5.0.1.xml`,
      `${__dirname}\\..\\..\\toolkitsCache\\com.ibm.streamsx.avro-1.2.1.xml`,
      `${__dirname}\\..\\..\\toolkitsCache\\com.ibm.streamsx.datetime-1.2.1.xml`,
      `${__dirname}\\..\\..\\toolkitsCache\\com.ibm.streamsx.dps-3.3.3.xml`,
      `${__dirname}\\..\\..\\toolkitsCache\\com.ibm.streamsx.elasticsearch-2.1.1.xml`,
      `${__dirname}\\..\\..\\toolkitsCache\\com.ibm.streamsx.hbase-3.3.0.xml`,
      `${__dirname}\\..\\..\\toolkitsCache\\com.ibm.streamsx.hdfs-4.3.0.xml`,
      `${__dirname}\\..\\..\\toolkitsCache\\com.ibm.streamsx.inet-3.0.0.xml`,
      `${__dirname}\\..\\..\\toolkitsCache\\com.ibm.streamsx.iot-1.2.0.xml`,
      `${__dirname}\\..\\..\\toolkitsCache\\com.ibm.streamsx.jdbc-1.4.3.xml`,
      `${__dirname}\\..\\..\\toolkitsCache\\com.ibm.streamsx.json-1.5.1.xml`,
      `${__dirname}\\..\\..\\toolkitsCache\\com.ibm.streamsx.kafka-1.7.3.xml`,
      `${__dirname}\\..\\..\\toolkitsCache\\com.ibm.streamsx.messagehub-1.7.4.xml`,
      `${__dirname}\\..\\..\\toolkitsCache\\com.ibm.streamsx.messaging-5.3.12.xml`,
      `${__dirname}\\..\\..\\toolkitsCache\\com.ibm.streamsx.mqtt-1.0.0.xml`,
      `${__dirname}\\..\\..\\toolkitsCache\\com.ibm.streamsx.network-3.1.0.xml`,
      `${__dirname}\\..\\..\\toolkitsCache\\com.ibm.streamsx.objectstorage-1.9.1.xml`,
      `${__dirname}\\..\\..\\toolkitsCache\\com.ibm.streamsx.rabbitmq-1.2.1.xml`,
      `${__dirname}\\..\\..\\toolkitsCache\\com.ibm.streamsx.sparkmllib-1.1.1.xml`,
      `${__dirname}\\..\\..\\toolkitsCache\\com.ibm.streamsx.topology-1.11.10.xml`,
      `${__dirname}\\..\\..\\toolkitsCache\\spl-1.4.0.xml`];
    it('tests the getCachedToolkitIndexPaths function\'s output', () => {
      expect(cachedToolkitsIndex).toEqual(expectedOutput);
    });
  });
  describe('getAllToolkits()', () => {
    let toolkits;
    beforeEach(() => {
      toolkits = StreamsToolkitsUtils.getAllToolkits(`${__dirname}\\..\\..\\toolkitsCache`, `${__dirname}\\toolkits`);
    });
    const expectedOutput = expectedOutputCachedToolkits.concat(expectedOutputLocalToolkis);
    it('tests the getAllToolkits function\'s output', () => {
      expect(toolkits).toEqual(expectedOutput);
    });
  });
});
