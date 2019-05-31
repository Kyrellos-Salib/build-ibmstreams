'use babel';

import StreamsUtils from '../../lib/util/streams-utils';

describe('streams-utils', () => {
  describe('getFqnMainComposites', () => {
    it('tests the getFqnMainComposites function\'s output', () => {
      const fqnMainComposites = StreamsUtils.getFqnMainComposites(`${__dirname}//splFiles/HelloWorld.spl`);
      const expectedOutput = { fqn: 'HelloWorld', namespace: '', mainComposites: ['HelloWorld'] };
      expect(fqnMainComposites).toEqual(expectedOutput);
    });
  });
  describe('getFqnMainComposites 2', () => {
    it('tests the getFqnMainComposites (2) function\'s output', () => {
      const fqnMainComposites = StreamsUtils.getFqnMainComposites(`${__dirname}//splFiles/cars.spl`);
      const expectedOutput = { fqn: '', namespace: '', mainComposites: ['cars', 'FileIngest'] };
      expect(fqnMainComposites).toEqual(expectedOutput);
    });
  });
  describe('parseV4ServiceCredentials', () => {
    it('tests the parseV4ServiceCredentials function\'s output', () => {
      const parsedCreds = StreamsUtils.parseV4ServiceCredentials('{"apikey": "nzbx0lzhMR9-JEABT5v0ekKwvD9T601bRCf-O4xeB2N7",\n"iam_apikey_description": "Auto-generated for key bb406ea8-3121-4786-ba2f-e9a08ce53eea",\n"iam_apikey_name": "Service credentials-1",\n"iam_role_crn": "crn:v1:bluemix:public:iam::::serviceRole:Manager",\n"iam_serviceid_crn": "crn:v1:bluemix:public:iam-identity::a/0dbb2318ddfc499591e23816b185fa8a::serviceid:ServiceId-41d0bc8f-955c-4b7f-833f-e4282eba3d85",\n"v2_rest_url": "https://svc-cf.us-south.streaming-analytics.cloud.ibm.com/v2/streaming_analytics/11134f6b-f7ef-4546-a1cf-b5ca5ed2b1da"}');
      const expectedOutput = {
        apikey: 'nzbx0lzhMR9-JEABT5v0ekKwvD9T601bRCf-O4xeB2N7',
        iam_apikey_description: 'Auto-generated for key bb406ea8-3121-4786-ba2f-e9a08ce53eea',
        iam_apikey_name: 'Service credentials-1',
        iam_role_crn: 'crn:v1:bluemix:public:iam::::serviceRole:Manager',
        iam_serviceid_crn: 'crn:v1:bluemix:public:iam-identity::a/0dbb2318ddfc499591e23816b185fa8a::serviceid:ServiceId-41d0bc8f-955c-4b7f-833f-e4282eba3d85',
        v2_rest_url: 'https://svc-cf.us-south.streaming-analytics.cloud.ibm.com/v2/streaming_analytics/11134f6b-f7ef-4546-a1cf-b5ca5ed2b1da'
      };
      expect(parsedCreds).toEqual(expectedOutput);
    });
  });
});
