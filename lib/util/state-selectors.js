'use babel';
'use strict';

import { createSelector } from 'reselect';
import { Map } from 'immutable';

/**
 * build state selectors
 */

const getBase = (state) => Map(state.streamsV5Build);

const getPackageActivated = createSelector(
  getBase,
  (base = Map()) => base.getIn(['packageActivated'])
);

const getLoginFormInitialized = createSelector(
  getBase,
  (base = Map()) => base.getIn(['formData', 'loginFormInitialized'])
);

const getBuildOriginator = createSelector(
  getBase,
  (base = Map()) => base.getIn(['buildOriginator'])
);

const getSelectedInstance = createSelector(
  getBase,
  (base = Map()) => base.getIn(['selectedInstance'])
);

const getBuilds = createSelector(
  getBase,
  (base = Map()) => base.getIn(['builds'])
);

const getSelectedInstanceName = createSelector(
  getBase,
  (base = Map()) => base.getIn(['selectedInstance', 'instanceName'])
);

const getIcp4dBearerToken = createSelector(
  getBase,
  (base = Map()) => base.getIn(['icp4dAuthToken'])
);

const getStreamsBearerToken = createSelector(
  getBase,
  (base = Map()) => base.getIn(['selectedInstance', 'streamsAuthToken'])
);

const getCurrentLoginStep = createSelector(
  getBase,
  (base = Map()) => base.getIn(['currentLoginStep'])
);

const getIcp4dAuthError = createSelector(
  getBase,
  (base = Map()) => base.getIn(['icp4dAuthError'])
);

const getStreamsAuthError = createSelector(
  getBase,
  (base = Map()) => base.getIn(['streamsAuthError'])
);

const getServiceInstanceId = createSelector(
  getBase,
  (base = Map()) => base.getIn(['selectedInstance', 'serviceInstanceId'])
);

const getStreamsInstances = createSelector(
  getBase,
  (base = Map()) => base.getIn(['streamsInstances'])
);

const getUsername = createSelector(
  getBase,
  (base = Map()) => base.getIn(['username'])
);

const hasAuthenticatedIcp4d = (state) => typeof getIcp4dBearerToken(state) === 'string';
const hasAuthenticatedToStreamsInstance = (state) => typeof getStreamsBearerToken(state) === 'string';

const getRememberPassword = createSelector(
  getBase,
  (base = Map()) => base.getIn(['rememberPassword'])
);

const getFormUsername = createSelector(
  getBase,
  (base = Map()) => base.getIn(['formData', 'username'])
);

const getFormPassword = createSelector(
  getBase,
  (base = Map()) => base.getIn(['formData', 'password'])
);

const getFormRememberPassword = createSelector(
  getBase,
  (base = Map()) => base.getIn(['formData', 'rememberPassword'])
);

// temporary build details; before getting a build id
const getNewBuild = createSelector(
  getBase,
  getSelectedInstanceName,
  (base = Map(), selectedInstanceName) => base.getIn(['builds', selectedInstanceName, 'newBuild'])
);

const getBuildsForSelectedInstance = createSelector(
  getBase,
  getSelectedInstanceName,
  (base = Map(), instanceName) => base.getIn(['builds', instanceName])
);

// build
const getBuild = (state, buildId) => {
  const base = getBase(state);
  if (base) {
    const builds = getBuildsForSelectedInstance(state);
    if (builds) {
      return builds[buildId];
    }
  }
  return {};
  // const builds = getBuildsForSelectedInstance(state);
  // return builds[buildId];
};

const getBuildStatusBase = createSelector(
  getBuild,
  build => build.status
);

const getBuildStatus = (state, buildId) => getBuild(state, buildId).status;

const getBuildLogMessages = (state, buildId) => getBuild(state, buildId).logMessages;

const getBuildArtifacts = (state, buildId) => getBuild(state, buildId).artifacts;

// artifact object for specific artifact id of build
const getBuildArtifact = (state, buildId, artifactId) => getBuildArtifacts(state, buildId).find(artifact => artifact.id === artifactId);

// application root path
const getProjectPath = (state, buildId) => getBuild(state, buildId).appRoot;

// computed fs path to  use for downloading artifact
const getOutputArtifactFilePath = (state, buildId, artifactId) => {
  const artifact = getBuildArtifact(state, buildId, artifactId);
  const projectPath = getProjectPath(state, buildId);
  return `${projectPath}/output/${artifact.name}`;
};

const getMessageHandlerIdentifier = (state, buildId) => {
  const build = getBuild(state, buildId);
  return build.fqn || build.makefilePath;
};

const getToolkitsCacheDir = createSelector(
  getBase,
  base => { console.log(base); return base.getIn(['toolkitsCacheDir']); }
);

const getToolkitsPathSetting = createSelector(
  getBase,
  base => base.getIn(['toolkitsPathSetting'])
);

/**
 * Base configuration and authentication state selectors
 */


const getIcp4dUrl = createSelector(
  getBase,
  (base = Map()) => base.getIn(['icp4dUrl'])
);

const baseGetStreamsBuildRestUrl = createSelector(
  getBase,
  (base = Map()) => base.getIn(['selectedInstance', 'streamsBuildRestUrl'])
);

const baseGetStreamsRestUrl = createSelector(
  getBase,
  (base = Map()) => base.getIn(['selectedInstance', 'streamsRestUrl'])
);

const baseGetStreamsConsoleUrl = createSelector(
  getBase,
  (base = Map()) => base.getIn(['selectedInstance', 'streamsConsoleUrl'])
);

const baseGetStreamsJmxUrl = createSelector(
  getBase,
  (base = Map()) => base.getIn(['selectedInstance', 'streamsConsoleUrl'])
);

const getStreamsBuildRestUrl = createSelector(
  getIcp4dUrl,
  baseGetStreamsBuildRestUrl,
  (icp4dUrlString, buildRestUrlString) => {
    let buildRestUrlStr = convertUrl(icp4dUrlString, buildRestUrlString);
    if (buildRestUrlStr.endsWith('/builds')) {
      buildRestUrlStr = buildRestUrlStr.substring(0, buildRestUrlStr.lastIndexOf('/builds'));
    }
    return buildRestUrlStr;
  }
);

const getStreamsRestUrl = createSelector(
  getIcp4dUrl,
  baseGetStreamsRestUrl,
  (icp4dUrlString, streamsRestUrlString) => {
    return convertUrl(icp4dUrlString, streamsRestUrlString);
  }
);

const getStreamsConsoleUrl = createSelector(
  getIcp4dUrl,
  baseGetStreamsConsoleUrl,
  (icp4dUrlString, streamsConsoleUrlString) => {
    return convertUrl(icp4dUrlString, streamsConsoleUrlString);
  }
);

const getStreamsJmxUrl = createSelector(
  getIcp4dUrl,
  baseGetStreamsJmxUrl,
  (icp4dUrlString, streamsJmxUrlString) => {
    return convertUrl(icp4dUrlString, streamsJmxUrlString);
  }
);

const convertUrl = (icp4dUrlString, endpointUrlString) => {
  let endpointUrlStr = endpointUrlString;
  if (endpointUrlStr.includes('172')) {
    const icp4dUrl = new URL(icp4dUrlString); /* eslint-disable-line compat/compat */
    const streamsRestUrl = new URL(endpointUrlStr); /* eslint-disable-line compat/compat */
    streamsRestUrl.hostname = icp4dUrl.hostname;
    endpointUrlStr = streamsRestUrl.toString();
  }
  return endpointUrlStr;
};


const StateSelector = {
  getPackageActivated,
  getBuildOriginator,
  getLoginFormInitialized,
  getUsername,
  getRememberPassword,
  getCurrentLoginStep,
  getIcp4dAuthError,
  getStreamsAuthError,

  getFormUsername,
  getFormPassword,
  getFormRememberPassword,

  getIcp4dUrl,
  getStreamsRestUrl,
  getStreamsBuildRestUrl,
  getStreamsConsoleUrl,
  getStreamsJmxUrl,
  getIcp4dBearerToken,
  hasAuthenticatedIcp4d,
  getStreamsBearerToken,
  hasAuthenticatedToStreamsInstance,
  getSelectedInstanceName,
  getServiceInstanceId,
  getStreamsInstances,

  getNewBuild,
  getBuildStatus,
  getBuildLogMessages,

  getBuildArtifacts,
  getBuildArtifact,
  getOutputArtifactFilePath,

  getToolkitsCacheDir,
  getToolkitsPathSetting,

  getMessageHandlerIdentifier
};

export default StateSelector;
