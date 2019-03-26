'use babel';
'use strict';

function getArray(payload, key) {

}

function getValue(payload, key) {

}

function getSelectedInstanceActionPayload(selectedInstanceObj) {
  console.log('Selected Instance obj: ', selectedInstanceObj);
  const serviceInstanceId = selectedInstanceObj.ID;
  const instanceName = selectedInstanceObj.ServiceInstanceDisplayName;
  const serviceInstanceVersion = selectedInstanceObj.ServiceInstanceVersion;
  const streamsRestUrl = selectedInstanceObj.CreateArguments['connection-info'].externalRestEndpoint;
  const streamsBuildRestUrl = selectedInstanceObj.CreateArguments['connection-info'].externalBuildEndpoint;
  const streamsConsoleUrl = selectedInstanceObj.CreateArguments['connection-info'].externalConsoleEndpoint;
  const streamsJmxUrl = selectedInstanceObj.CreateArguments['connection-info'].externalJmxEndpoint;
  return {
    serviceInstanceId, instanceName, serviceInstanceVersion, streamsRestUrl, streamsBuildRestUrl, streamsConsoleUrl, streamsJmxUrl
  };
}

function getIcp4dAuthToken(authTokenResponse) {
  console.log('authToken response: ', authTokenResponse);
  return authTokenResponse.body.token;
}

function getStreamsAuthToken(authTokenResponse) {
  console.log('authToken response: ', authTokenResponse);
  return authTokenResponse.body.AccessToken;
}

function getBuildId(createBuildResponse) {
  console.log('createBuild response: ', createBuildResponse);
  return createBuildResponse.body.build.split('/').pop();
}

function getBuildStatusFromResponse(buildStatusResponse) {
  console.log('buildStatusResponse', buildStatusResponse);
  const { body } = buildStatusResponse;
  return {
    status: body.status,
    buildId: body.id,
    inactivityTimeout: body.inactivityTimeout,
    submitCount: body.submitCount,
    lastActivityTime: body.lastActivityTime

  };
}

function getArtifactsFromResponse(artifactsResponse) {
  console.log('build artifacts response: ', artifactsResponse);
  const { body } = artifactsResponse;
  return {
    artifacts: body.artifacts
  };
}

const StreamsJsonUtils = {
  getArray,
  getValue,
  getSelectedInstanceActionPayload,
  getIcp4dAuthToken,
  getBuildId,
  getBuildStatusFromResponse,
  getArtifactsFromResponse,
  getStreamsAuthToken
};

export default StreamsJsonUtils;
