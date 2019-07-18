'use babel';

import * as path from 'path';
import StreamsUtils from '../../lib/util/streams-utils';

describe('streams-utils', () => {
  describe('getFqnMainComposites', () => {
    it('tests the getFqnMainComposites function\'s output', () => {
      const fqnMainComposites = StreamsUtils.getFqnMainComposites(`${__dirname}${path.sep}..${path.sep}splFiles${path.sep}simple${path.sep}simpleApp.spl`);
      const expectedOutput = { fqn: 'test', namespace: '', mainComposites: ['test'] };
      expect(fqnMainComposites).toEqual(expectedOutput);
    });
  });
  describe('getFqnMainComposites 2', () => {
    it('tests the getFqnMainComposites (2) function\'s output', () => {
      const fqnMainComposites = StreamsUtils.getFqnMainComposites(`${__dirname}${path.sep}..${path.sep}splFiles${path.sep}utils${path.sep}twoCompositesApp.spl`);
      const expectedOutput = { fqn: '', namespace: '', mainComposites: ['testName1', 'testName2'] };
      expect(fqnMainComposites).toEqual(expectedOutput);
    });
  });
  describe('parseV4ServiceCredentials', () => {
    it('tests the parseV4ServiceCredentials function\'s output', () => {
      const parsedCreds = StreamsUtils.parseV4ServiceCredentials('{"apikey": "test key",\n"iam_apikey_description": "test description",\n"iam_apikey_name": "test name",\n"iam_role_crn": "test role",\n"iam_serviceid_crn": "test id",\n"v2_rest_url": "test url"}');
      const expectedOutput = {
        apikey: 'test key',
        iam_apikey_description: 'test description',
        iam_apikey_name: 'test name',
        iam_role_crn: 'test role',
        iam_serviceid_crn: 'test id',
        v2_rest_url: 'test url'
      };
      expect(parsedCreds).toEqual(expectedOutput);
    });
  });
});
