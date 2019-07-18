'use babel';

import * as path from 'path';

const fse = require('fs-extra');
const fs = require('fs');

describe('post test operations', () => {
  let done = false;
  if (fs.existsSync(`${__dirname}${path.sep}BuildTest${path.sep}BuildSourceArchive${path.sep}toolkits`)) {
    fse.removeSync(`${__dirname}${path.sep}BuildTest${path.sep}BuildSourceArchive${path.sep}toolkits`);
  }
  if (fs.existsSync(`${__dirname}${path.sep}splFiles${path.sep}simple${path.sep}.build_test_1000.zip`)) {
    fs.unlinkSync(`${__dirname}${path.sep}splFiles${path.sep}simple${path.sep}.build_test_1000.zip`);
  }
  if (fse.removeSync(`${__dirname}${path.sep}UtilsTest${path.sep}toolkits`)) {
    fse.removeSync(`${__dirname}${path.sep}UtilsTest${path.sep}toolkits`);
  }
  done = true;
  it('makes sure everthing is clean', () => {
    expect(done).toEqual(true);
  });
});
