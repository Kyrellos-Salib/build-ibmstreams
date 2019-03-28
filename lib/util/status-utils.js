'use babel';
'use strict';

import MessageHandlerRegistry from '../message-handler-registry';
import getStore from '../redux-store/configure-store';
import {
  downloadAppBundles,
  submitApplications,
  openStreamingAnalyticsConsole
} from '../actions';
import StateSelector from './state-selectors';

function buildStatusUpdate(action, state) {
  console.log('buildStatusUpdate func input,', action, state);
  const { buildId } = action;
  const buildStatus = StateSelector.getBuildStatus(state, buildId);
  const logMessages = StateSelector.getBuildLogMessages(state, buildId);
  const messageHandler = getMessageHandlerForBuildId(state, buildId);
  console.log(buildStatus, logMessages, messageHandler);
  if (buildStatus === 'built') {
    messageHandler.handleSuccess('Build Succeeded', {
      detail: `${buildId}: ${buildStatus}`,
      notificationButtons: [
        {
          label: 'Test',
          callbackFn: () => {
            // trigger
            console.log('Test button callback');
            getStore().dispatch(downloadAppBundles(buildId));
          }
        }
      ]
    });
  } else if (buildStatus === 'failed') {
    messageHandler.handleError('Build Failed', { detail: logMessages, showNotification: true });
  } else if (buildStatus === 'building') {
    messageHandler.handleInfo('Build in progress', { detail: logMessages.join('\n'), showNotification: true });
  }
}

function downloadOrSubmit(state, buildId) {
  console.log('downloadOrSubmit', state, buildId);
  const buildStatus = StateSelector.getBuildStatus(state, buildId);
  if (buildStatus === 'built') {
    const artifacts = StateSelector.getBuildArtifacts(state, buildId);
    const messageHandler = getMessageHandlerForBuildId(state, buildId);
    const identifier = StateSelector.getMessageHandlerIdentifier(state, buildId);
    const submissionTarget = identifier.includes('/') ? 'the application(s) for the Makefile' : identifier;
    if (Array.isArray(artifacts) && artifacts.length > 0) {
      messageHandler.handleInfo(`Job Submission - ${identifier}`, {
        detail: `Submit ${submissionTarget} to your service with default configuration or use the Streaming Analytics Console to customize the submission time configuration.`,
        notificationAutoDismiss: false,
        notificationButtons: [
          {
            label: 'Submit',
            callbackFn: () => {
              console.log('submitCallback');
              messageHandler.handleInfo('Submitting application');
              getStore().dispatch(submitApplications(buildId, true));
            }
          },
          {
            label: 'Submit via Streams Console',
            callbackFn: () => {
              console.log('download and open console');
              messageHandler.handleInfo('Downloading application bundle(s)');
              getStore().dispatch(downloadAppBundles(buildId));
              getStore().dispatch(openStreamingAnalyticsConsole());
            }
          }
        ]
      });
    }
  }
}

function jobSubmitted(state, submitInfo, buildId) {
  console.log('job submitted:', state, buildId, submitInfo);
  const messageHandler = buildId ? getMessageHandlerForBuildId(state, buildId) : MessageHandlerRegistry.getDefault();
  if (submitInfo.status === 'running') {
    messageHandler.handleSuccess(
      `Job ${submitInfo.name} has been successfully submitted to the ${StateSelector.getSelectedInstanceName(state)} instance`,
      {
        detail: 'To monitor or manage the job, use the ICP4D Manage Jobs page or the Streams console',
        notificationAutoDismiss: false,
        notificationButtons: [
          {
            label: 'Open ICP4D Console',
            callbackFn: () => {
              const icp4dUrlStr = StateSelector.getIcp4dUrl(state);
              const icp4dUrl = new URL(icp4dUrlStr); /* eslint-disable-line compat/compat */
              const icp4dUrlBase = `${icp4dUrl.protocol}//${icp4dUrl.host}`;
              const jobDetailsUrl = `${icp4dUrlBase}/streams/webpage/#/streamsJobDetails/streams-${StateSelector.getServiceInstanceId(state)}-${submitInfo.id}`;
              MessageHandlerRegistry.openUrl(jobDetailsUrl);
            }
          },
          {
            label: 'Open Streams Console',
            callbackFn: () => {
              const consoleUrl = StateSelector.getStreamsConsoleUrl(state);
              const jobName = submitInfo.name;
              MessageHandlerRegistry.openUrl(`${consoleUrl}#application/dashboard/Application%20Dashboard?job=${jobName}`);
            }
          }
        ]
      }
    );
  }
}

function getMessageHandlerForBuildId(state, buildId) {
  const identifier = StateSelector.getMessageHandlerIdentifier(state, buildId);
  return MessageHandlerRegistry.get(identifier);
}

const StatusUtils = {
  buildStatusUpdate,
  downloadOrSubmit,
  jobSubmitted,
  getMessageHandlerForBuildId
};

export default StatusUtils;
