'use babel';

import KeychainUtils from '../../lib/util/keychain-utils';

describe('keychain-utils functions', () => {
  describe('deleteAllCredentials and credentialsExist functions', () => {
    beforeEach(async () => {
      await KeychainUtils.deleteAllCredentials();
    });
    it('tests the deleteAllCredentials and credentialsExist functions\' outputs', async () => {
      expect(await KeychainUtils.credentialsExist()).toEqual(false);
      await KeychainUtils.addCredentials('test', 'test');
      expect(await KeychainUtils.credentialsExist()).toEqual(true);
    });
  });
  describe('getAllCredentials', () => {
    let creds;
    beforeEach(async () => {
      await KeychainUtils.deleteAllCredentials();
      await KeychainUtils.addCredentials('admin', 'password');
      creds = await KeychainUtils.getAllCredentials();
    });
    const expectedOutput = [{ account: 'admin', password: 'password' }];
    it('tests the getAllCredentials function\'s output', () => {
      expect(creds).toEqual(expectedOutput);
    });
  });
  describe('getCredentials, addCredentials and deleteCredentials', () => {
    it('tests the getCredentials, addCredentials and deleteCredentials functions\' outputs', async () => {
      expect(await KeychainUtils.getAllCredentials()).toEqual([{ account: 'admin', password: 'password' }]);
      await KeychainUtils.addCredentials('test', 'testPass');
      expect(await KeychainUtils.getAllCredentials()).toEqual([{ account: 'test', password: 'testPass' }, { account: 'admin', password: 'password' }]);
      expect(await KeychainUtils.getCredentials('test')).toEqual('testPass');
      await KeychainUtils.deleteCredentials('test');
      expect(await KeychainUtils.getAllCredentials()).toEqual([{ account: 'admin', password: 'password' }]);
    });
  });
});
