'use babel';
'use strict';

import * as path from 'path';
import * as fs from 'fs';

import { Observable } from 'rxjs';

import StateSelector from './state-selectors';

const request = require('request');

const baseRequestOptions = {
  method: 'GET',
  // jar: true,
  json: true,
  gzip: true,
  timeout: 60000,
  agentOptions: {
    rejectUnauthorized: false
  },
  ecdhCurve: 'auto',
  // auth: getStreamsAuth(state),
  // auth: {
  //   user: 'admin',
  //   password: 'password',
  //   bearer: getBearerToken
  // },
  // auth: {
  //   bearer: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjdXN0b20iOnsiTW9kdWxlTmFtZSI6InN0cmVhbXMiLCJSb2xlIjoiVXNlciIsIlNlcnZpY2VJbnN0YW5jZURpc3BsYXlOYW1lIjoic2FtcGxlIiwiU2VydmljZUluc3RhbmNlSUQiOiIxNTUwNzQ4NzY5IiwiU2VydmljZUluc3RhbmNlVXNlck5hbWUiOiJtYXJ5IiwiWmVuRGlzcGxheU5hbWUiOiJtYXJ5IGtvbW9yIiwiWmVuVUlEIjoiMTAwMyIsIlplblVzZXJuYW1lIjoibWFyeSJ9LCJleHAiOjE1NTA4NDg1OTYsImlhdCI6MTU1MDg0NzM5NiwiaXNzIjoiSUNQRCIsInN1YiI6Im1hcnkiLCJ1aWQiOiIxMDAzIn0.DGS_fKpu0wNSe9m_yaNaQU2Rz9h9_Zi4prJ4h02ttK10DHm-4khBjVpjdXsZTygpLCaHnl48OfiIOowg9ybFnzrKwxnuNLaQ8ZGiDys-4N8PpcwxsyubO3ZjAet1aTELPrtQEgpLqsSZWEaADE5FNzax3MyWkSusCn7KyV3qwvu5hBSJ3eDsqnCCx23XuFrV3PbD9W0YupDIfvWCkEmNmZorJ006unR1eV2AiNMIQzm27fbHGO3JeHPc4_kQv4debbaiab0THj4XKaio5bLV83bQm5q4ceSEJzNkJQzzRqKT22LaNFK0ji8HmQt9fGs3Eb5U-OhxDNGT3z6mjvLCyA'
  // },
  strictSSL: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  },
};

const baseRequest = request.defaults(baseRequestOptions);

/**
 *  StreamsRestUtil.build
 */

function getAll(state) {
  const options = {
    url: `${StateSelector.getStreamsBuildRestUrl(state)}/builds`,
    auth: getStreamsAuth(state)
  };
  return observableRequest(baseRequest, options).subscribe(a => console.log(a), b => console.log(b), c => console.log(c));
}

function getStatus(state, buildId) {
  const options = {
    url: `${StateSelector.getStreamsBuildRestUrl(state)}/builds/${buildId}`,
    auth: getStreamsAuth(state)
  };
  return observableRequest(baseRequest, options);
}

function create(
  state,
  {
    inactivityTimeout,
    incremental,
    name,
    type
  } = {
    inactivityTimeout: 15,
    incremental: true,
    name: 'myBuild',
    type: 'application'
  }
) {
  const options = {
    method: 'POST',
    url: `${StateSelector.getStreamsBuildRestUrl(state)}/builds`,
    auth: getStreamsAuth(state),
    body: {
      inactivityTimeout,
      incremental,
      name,
      originator: StateSelector.getBuildOriginator(state) || 'unknown',
      type
    }
  };
  return observableRequest(baseRequest, options);
}

function deleteBuild(state, buildId) {
  const options = {
    method: 'DELETE',
    url: `${StateSelector.getStreamsBuildRestUrl(state)}/builds/${buildId}`,
    auth: getStreamsAuth(state),
    headers: {
      Accept: '*/*'
    }
  };
  return observableRequest(baseRequest, options);
}

function uploadSource(state, buildId, sourceZipPath) {
  const options = {
    method: 'PUT',
    json: false,
    url: `${StateSelector.getStreamsBuildRestUrl(state)}/builds/${buildId}`,
    auth: getStreamsAuth(state),
    headers: {
      'Content-Type': 'application/zip'
    },
    encoding: null,
    body: fs.createReadStream(sourceZipPath)
  };
  return observableRequest(baseRequest, options);
}

function updateSource(state, buildId, sourceZipPath) {
  const options = {
    method: 'PATCH',
    url: `${StateSelector.getStreamsBuildRestUrl(state)}/builds/${buildId}`,
    auth: getStreamsAuth(state),
    headers: {
      'Content-Type': 'application/zip'
    },
    formData: {
      file: {
        value: fs.createReadStream(sourceZipPath),
        options: {
          filename: sourceZipPath.split(path.sep).pop(),
          contentType: 'application/zip'
        }
      }
    }
  };
  return observableRequest(baseRequest, options);
}

function getLogMessages(state, buildId) {
  const options = {
    url: `${StateSelector.getStreamsBuildRestUrl(state)}/builds/${buildId}/logmessages`,
    auth: getStreamsAuth(state),
    json: false,
    headers: {
      Accept: 'text/plain'
    }
  };
  return observableRequest(baseRequest, options);
}

function start(state, buildId, { buildConfigOverrides = {} } = {}) {
  const options = {
    method: 'POST',
    url: `${StateSelector.getStreamsBuildRestUrl(state)}/builds/${buildId}/actions`,
    auth: getStreamsAuth(state),
    body: {
      type: 'submit',
      buildConfigOverrides
    }
  };
  return observableRequest(baseRequest, options);
}

function cancel(state, buildId, { buildConfigOverrides = {} } = {}) {
  const options = {
    method: 'POST',
    url: `${StateSelector.getStreamsBuildRestUrl(state)}/builds/${buildId}/actions`,
    auth: getStreamsAuth(state),
    body: {
      type: 'cancel',
      buildConfigOverrides
    }
  };
  return observableRequest(baseRequest, options);
}

function getSnapshots(state) {
  const options = {
    url: `${StateSelector.getStreamsBuildRestUrl(state)}/builds/snapshot`,
    auth: getStreamsAuth(state),
  };
  return observableRequest(baseRequest, options);
}

/**
 *  StreamsRestUtil.artifact
 */

function getArtifacts(state, buildId) {
  const options = {
    url: `${StateSelector.getStreamsBuildRestUrl(state)}/builds/${buildId}/artifacts`,
    auth: getStreamsAuth(state),
  };
  return observableRequest(baseRequest, options);
}

function getArtifact(state, buildId, artifactId) {
  const options = {
    url: `${StateSelector.getStreamsBuildRestUrl(state)}/builds/${buildId}/artifacts/${artifactId}`,
    auth: getStreamsAuth(state),
  };
  return observableRequest(baseRequest, options);
}

function getAdl(state, buildId, artifactId) {
  const options = {
    url: `${StateSelector.getStreamsBuildRestUrl(state)}/builds/${buildId}/artifacts/${artifactId}/adl`,
    auth: getStreamsAuth(state),
    headers: {
      Accept: 'text/xml'
    }
  };
  return observableRequest(baseRequest, options);
}

function downloadApplicationBundle(state, buildId, artifactId) {
  const options = {
    url: `${StateSelector.getStreamsBuildRestUrl(state)}/builds/${buildId}/artifacts/${artifactId}/applicationbundle`,
    auth: getStreamsAuth(state),
    encoding: null,
    headers: {
      Accept: 'application/x-jar',
    }
  };
  return observableRequest(baseRequest, options);
}

function uploadApplicationBundleToInstance(state, applicationBundlePath) {
  const options = {
    method: 'POST',
    url: `${StateSelector.getStreamsRestUrl(state)}/applicationbundles`,
    auth: getStreamsAuth(state),
    headers: {
      'Content-Type': 'application/x-jar',
      Accept: 'application/json'
    },
    json: false,
    body: fs.createReadStream(applicationBundlePath)
  };
  return observableRequest(baseRequest, options);
}

function submitJob(
  state,
  applicationBundleIdOrUrl,
  {
    applicationCredentials,
    jobConfig,
    jobGroup,
    jobName,
    preview,
    submitParameters
  } = {
    preview: false,
    jobGroup: 'default',
    jobName: 'myJob',
    submitParameters: [],
    jobConfig: {},
    applicationCredentials: {}
  }
) {
  const options = {
    method: 'POST',
    url: `${StateSelector.getStreamsRestUrl(state)}/jobs`,
    auth: getStreamsAuth(state),
    body: {
      application: applicationBundleIdOrUrl,
      preview,
      jobGroup,
      jobName,
      submitParameters,
      jobConfigurationOverlay: jobConfig,
      applicationCredentials: {
        bearerToken: StateSelector.getStreamsBearerToken(state)
      }
    }
  };
  return observableRequest(baseRequest, options);
}

/**
 *  StreamsRestUtil.toolkit
 */

function getToolkits(state) {
  const options = {
    url: `${StateSelector.getStreamsBuildRestUrl(state)}/toolkits`,
    auth: getStreamsAuth(state),
  };
  return observableRequest(baseRequest, options);
}

function getToolkit(state, toolkitId) {
  const options = {
    url: `${StateSelector.getStreamsBuildRestUrl(state)}/toolkits/${toolkitId}`,
    auth: getStreamsAuth(state),
  };
  return observableRequest(baseRequest, options);
}

function addToolkit(state, toolkitZipPath) {
  const options = {
    method: 'POST',
    url: `${StateSelector.getStreamsBuildRestUrl(state)}/toolkits`,
    auth: getStreamsAuth(state),
    headers: {
      'Content-Type': 'application/zip'
    },
    formData: {
      file: {
        value: fs.createReadStream(toolkitZipPath),
        options: {
          filename: toolkitZipPath.split(path.sep).pop(),
          contentType: 'application/x-jar'
        }
      }
    }
  };
  return observableRequest(baseRequest, options);
}

function deleteToolkit(state, toolkitId) {
  const options = {
    method: 'DELETE',
    url: `${StateSelector.getStreamsBuildRestUrl(state)}/toolkits/${toolkitId}`,
    auth: getStreamsAuth(state),
  };
  return observableRequest(baseRequest, options);
}

function getToolkitIndex(state, toolkitId) {
  const options = {
    url: `${StateSelector.getStreamsBuildRestUrl(state)}/toolkits/${toolkitId}/index`,
    auth: getStreamsAuth(state),
    headers: {
      Accept: 'text/xml'
    }
  };
  return observableRequest(baseRequest, options);
}

/**
 *  Helper functions
 */

function getIcp4dToken(state, username, password) {
  const options = {
    method: 'POST',
    url: `${StateSelector.getIcp4dUrl(state)}/icp4d-api/v1/authorize`,
    body: {
      username,
      password
    },
    ecdhCurve: 'auto'
  };
  return observableRequest(baseRequest, options);
}

function getServiceInstances(state) {
  const options = {
    url: `${StateSelector.getIcp4dUrl(state)}/zen-data/v2/serviceInstance`,
    auth: getIcp4dAuth(state),
  };
  return observableRequest(baseRequest, options);
}

function getStreamsAuthToken(state, instanceName) {
  const options = {
    method: 'POST',
    auth: getIcp4dAuth(state),
    url: `${StateSelector.getIcp4dUrl(state)}/zen-data/v2/serviceInstance/token`,
    body: {
      serviceInstanceDisplayname: instanceName
    }
  };
  return observableRequest(baseRequest, options);
}

function observableRequest(requestInst, options) {
  console.log('request options: ', options);
  return Observable.create((req) => {
    requestInst(options, (err, resp, body) => {
      if (err) {
        req.error(err);
      } else if (body && body.errors && Array.isArray(body.errors)) {
        req.error(body.errors.map(err1 => err1.message).join('\n'));
      } else if (resp.statusCode < 200 && resp.statusCode >= 300) {
        req.error(resp.statusMessage);
      } else {
        req.next({ resp, body });
      }
      req.complete();
    });
  });
}

function getStreamsAuth(state) {
  const token = StateSelector.getStreamsBearerToken(state);
  return token ? { bearer: token } : { username: 'admin', password: 'password' };
}

function getIcp4dAuth(state) {
  const token = StateSelector.getIcp4dBearerToken(state);
  return token ? { bearer: token } : { username: 'admin', password: 'password' };
}

/**
 *  Exports
 */

const build = {
  getAll,
  getStatus,
  create,
  deleteBuild,
  uploadSource,
  updateSource,
  getLogMessages,
  start,
  cancel,
  getSnapshots
};

const artifact = {
  getArtifacts,
  getArtifact,
  getAdl,
  downloadApplicationBundle,
  uploadApplicationBundleToInstance,
  submitJob
};

const toolkit = {
  getToolkits,
  getToolkit,
  addToolkit,
  deleteToolkit,
  getToolkitIndex
};

const icp4d = {
  getServiceInstances,
  getIcp4dToken,
  getStreamsAuthToken
};

const StreamsRestUtil = {
  build,
  artifact,
  toolkit,
  icp4d
};

export default StreamsRestUtil;
