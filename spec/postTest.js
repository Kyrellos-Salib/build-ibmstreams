'use babel';

const fse = require('fs-extra');
const fs = require('fs');

describe('post test operations', () => {
  let done = false;
  fse.removeSync(`${__dirname}\\BuildTest\\BuildSourceArchive\\toolkits\\streamsx.inet-2.9.6`);
  fse.removeSync(`${__dirname}\\UtilsTest\\toolkits\\streamsx.inet-2.9.6`);
  fs.unlinkSync(`${__dirname}\\UtilsTest\\splFiles\\.build_HelloWorld_1000.zip`);
  done = true;
  it('makes sure everthing is clean', () => {
    expect(done).toEqual(true);
  });
});
