'use babel';

const http = require('https');
const extract = require('extract-zip');
const fs = require('fs');

describe('preTest buildSourceArchive', async () => {
  const toolkitxml = '<?xml version="1.0" encoding="UTF-8" standalone="no" ?>\n<toolkitModel xmlns="http://www.ibm.com/xmlns/prod/streams/spl/toolkit" productVersion="4.3.0.3" xmlns:common="http://www.ibm.com/xmlns/prod/streams/spl/common" xmlns:ti="http://www.ibm.com/xmlns/prod/streams/spl/toolkitInfo" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><toolkit name="com.ibm.streamsx.inet" requiredProductVersion="4.0.1.0" version="2.9.6"></toolkit></toolkitModel>';
  let done = false;
  const download = (url, dest, cb) => {
    const file = fs.createWriteStream(dest);
    http.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(cb); // close() is async, call cb after close completes.
        extract(`${__dirname}\\BuildTest\\BuildSourceArchive\\toolkits\\toolkit.zip`, { dir: `${__dirname}\\BuildTest\\BuildSourceArchive\\toolkits` }, (err) => {
          // extraction is complete. make sure to handle the err
          if (err) {
            console.log(err);
          }
          console.log('extraction complete');
          fs.unlinkSync(`${__dirname}\\BuildTest\\BuildSourceArchive\\toolkits\\toolkit.zip`);
          fs.writeFileSync(`${__dirname}\\BuildTest\\BuildSourceArchive\\toolkits\\streamsx.inet-2.9.6\\com.ibm.streamsx.inet\\toolkit.xml`, toolkitxml);
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
        extract(`${__dirname}\\UtilsTest\\toolkits\\toolkit.zip`, { dir: `${__dirname}\\UtilsTest\\toolkits` }, (err) => {
          // extraction is complete. make sure to handle the err
          if (err) {
            console.log(err);
          }
          console.log('extraction complete');
          fs.unlinkSync(`${__dirname}\\UtilsTest\\toolkits\\toolkit.zip`);
          fs.writeFileSync(`${__dirname}\\UtilsTest\\toolkits\\streamsx.inet-2.9.6\\com.ibm.streamsx.inet\\toolkit.xml`, toolkitxml);
          fs.mkdirSync(`${__dirname}\\UtilsTest\\toolkits\\streamsx.inet-2.9.6\\com.ibm.streamsx.inet2`);
          fs.writeFileSync(`${__dirname}\\UtilsTest\\toolkits\\streamsx.inet-2.9.6\\com.ibm.streamsx.inet2\\toolkit.xml`, toolkitxml2);
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
