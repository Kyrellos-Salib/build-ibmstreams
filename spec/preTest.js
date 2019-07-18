'use babel';

import * as path from 'path';

const http = require('https');
const extract = require('extract-zip');
const fs = require('fs');
const fse = require('fs-extra');

describe('clean up', () => {
  let done = false;
  if (fs.existsSync(`${__dirname}${path.sep}BuildTest${path.sep}BuildSourceArchive${path.sep}toolkits`)) {
    fse.removeSync(`${__dirname}${path.sep}BuildTest${path.sep}BuildSourceArchive${path.sep}toolkits`);
  }
  if (fs.existsSync(`${__dirname}${path.sep}splFiles${path.sep}simple${path.sep}.build_test_1000.zip`)) {
    fs.unlinkSync(`${__dirname}${path.sep}splFiles${path.sep}simple${path.sep}.build_test_1000.zip`);
  }
  if (fse.existsSync(`${__dirname}${path.sep}UtilsTest${path.sep}toolkits`)) {
    fse.removeSync(`${__dirname}${path.sep}UtilsTest${path.sep}toolkits`);
  }
  if (!fs.existsSync(`${__dirname}${path.sep}BuildTest${path.sep}BuildSourceArchive${path.sep}toolkits`)) {
    fs.mkdirSync(`${__dirname}${path.sep}BuildTest${path.sep}BuildSourceArchive${path.sep}toolkits`);
  }
  if (!fs.existsSync(`${__dirname}${path.sep}UtilsTest${path.sep}toolkits`)) {
    fs.mkdirSync(`${__dirname}${path.sep}UtilsTest${path.sep}toolkits`);
  }
  done = true;
  it('makes sure everthing is clean', () => {
    waitsFor(() => done, 20000);
    expect(done).toEqual(true);
  });
});

describe('preTest buildSourceArchive', async () => {
  const toolkitxml = '<?xml version="1.0" encoding="UTF-8" standalone="no" ?>\n<toolkitModel xmlns="http://www.ibm.com/xmlns/prod/streams/spl/toolkit" productVersion="4.3.0.3" xmlns:common="http://www.ibm.com/xmlns/prod/streams/spl/common" xmlns:ti="http://www.ibm.com/xmlns/prod/streams/spl/toolkitInfo" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><toolkit name="com.ibm.streamsx.inet" requiredProductVersion="4.0.1.0" version="2.9.6"></toolkit></toolkitModel>';
  let done = false;
  const download = (url, dest, cb) => {
    const file = fs.createWriteStream(dest);
    http.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(cb); // close() is async, call cb after close completes.
        extract(`${__dirname}${path.sep}BuildTest${path.sep}BuildSourceArchive${path.sep}toolkits${path.sep}toolkit.zip`, { dir: `${__dirname}${path.sep}BuildTest${path.sep}BuildSourceArchive${path.sep}toolkits` }, (err) => {
          // extraction is complete. make sure to handle the err
          if (err) {
            console.log(err);
          }
          console.log('extraction complete');
          fs.unlinkSync(`${__dirname}${path.sep}BuildTest${path.sep}BuildSourceArchive${path.sep}toolkits${path.sep}toolkit.zip`);
          fs.writeFileSync(`${__dirname}${path.sep}BuildTest${path.sep}BuildSourceArchive${path.sep}toolkits${path.sep}streamsx.inet-2.9.6${path.sep}com.ibm.streamsx.inet${path.sep}toolkit.xml`, toolkitxml);
          done = true;
        });
      });
    }).on('error', (err) => { // Handle errors
      fs.unlink(dest); // Delete the file async. (But we don't check the result)
      if (cb) cb(err.message);
    });
  };
  download('https://codeload.github.com/IBMStreams/streamsx.inet/zip/v2.9.6', 'spec/BuildTest/BuildSourceArchive/toolkits/toolkit.zip', () => {
    console.log('zip downloaded');
  });
  it('makes sure the necessary files are downloaded and extracted', () => {
    waitsFor(() => done, 20000);
    runs(() => {
      expect(done).toEqual(true);
    });
  });
});

describe('preTest toolkit utils', async () => {
  const toolkitxml = '<?xml version="1.0" encoding="UTF-8" standalone="no" ?>\n<toolkitModel xmlns="http://www.ibm.com/xmlns/prod/streams/spl/toolkit" productVersion="4.3.0.3" xmlns:common="http://www.ibm.com/xmlns/prod/streams/spl/common" xmlns:ti="http://www.ibm.com/xmlns/prod/streams/spl/toolkitInfo" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><toolkit name="com.ibm.streamsx.inet" requiredProductVersion="4.0.1.0" version="2.9.6"></toolkit></toolkitModel>';
  const toolkitxml2 = '<?xml version="1.0" encoding="UTF-8" standalone="no" ?>\n<toolkitModel xmlns="http://www.ibm.com/xmlns/prod/streams/spl/toolkit" productVersion="4.3.0.3" xmlns:common="http://www.ibm.com/xmlns/prod/streams/spl/common" xmlns:ti="http://www.ibm.com/xmlns/prod/streams/spl/toolkitInfo" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><toolkit name="com.ibm.streamsx.inet2" requiredProductVersion="4.0.1.0" version="2.9.6"></toolkit></toolkitModel>';
  let done = false;
  const download = (url, dest, cb) => {
    const file = fs.createWriteStream(dest);
    http.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(cb); // close() is async, call cb after close completes.
        extract(`${__dirname}${path.sep}UtilsTest${path.sep}toolkits${path.sep}toolkit.zip`, { dir: `${__dirname}${path.sep}UtilsTest${path.sep}toolkits` }, (err) => {
          // extraction is complete. make sure to handle the err
          if (err) {
            console.log(err);
          }
          console.log('extraction complete');
          fs.unlinkSync(`${__dirname}${path.sep}UtilsTest${path.sep}toolkits${path.sep}toolkit.zip`);
          fs.writeFileSync(`${__dirname}${path.sep}UtilsTest${path.sep}toolkits${path.sep}streamsx.inet-2.9.6${path.sep}com.ibm.streamsx.inet${path.sep}toolkit.xml`, toolkitxml);
          fs.mkdirSync(`${__dirname}${path.sep}UtilsTest${path.sep}toolkits${path.sep}streamsx.inet-2.9.6${path.sep}com.ibm.streamsx.inet2`);
          fs.writeFileSync(`${__dirname}${path.sep}UtilsTest${path.sep}toolkits${path.sep}streamsx.inet-2.9.6${path.sep}com.ibm.streamsx.inet2${path.sep}toolkit.xml`, toolkitxml2);
          done = true;
        });
      });
    }).on('error', (err) => { // Handle errors
      fs.unlink(dest); // Delete the file async. (But we don't check the result)
      if (cb) cb(err.message);
    });
  };
  download('https://codeload.github.com/IBMStreams/streamsx.inet/zip/v2.9.6', 'spec/UtilsTest/toolkits/toolkit.zip', () => {
    console.log('zip downloaded');
  });
  it('makes sure the necessary files are downloaded and extracted', () => {
    waitsFor(() => done, 20000);
    runs(() => {
      expect(done).toEqual(true);
    });
  });
});
