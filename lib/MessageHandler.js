'use babel';
'use strict';

export default class MessageHandler {
  consoleService: null;

  constructor(service) {
    this.consoleService = service;
  }

  handleInfo(
    message,
    {
      detail = null,
      description = null,
      showNotification = true,
      showConsoleMessage = true,
      notificationAutoDismiss = true,
      notificationButtons = []
    } = {}
  ) {
    const addedButtons = this.processButtons(notificationButtons);
    const detailMessage = this.joinMessageArray(detail);

    if (showConsoleMessage) {
      this.consoleService.log(`${message}${detailMessage ? `\n${detailMessage}` : ''}`);
    }
    if (showNotification && typeof (message) === 'string') {
      const notificationOptions = {
        ...addedButtons,
        dismissable: !notificationAutoDismiss,
        detail: detailMessage || '',
        description: description || ''
      };
      return atom.notifications.addInfo(message, notificationOptions);
    }
  }

  handleError(
    message,
    {
      detail,
      description,
      stack,
      showNotification = true,
      showConsoleMessage = true,
      consoleErrorLog = true,
      notificationAutoDismiss = false,
      notificationButtons = []
    } = {}
  ) {
    const addedButtons = this.processButtons(notificationButtons);
    const detailMessage = this.joinMessageArray(detail);
    const stackMessage = this.joinMessageArray(stack);

    if (consoleErrorLog) {
      if (stack) {
        console.error(message, stack);
      } else {
        console.error(message);
      }
    }
    if (showConsoleMessage) {
      this.consoleService.error(message);
      if (typeof (detailMessage) === 'string' && detailMessage.length > 0) {
        this.consoleService.error(detailMessage);
      }
    }
    if (showNotification && typeof (message) === 'string') {
      const notificationOptions = {
        ...addedButtons,
        dismissable: !notificationAutoDismiss,
        detail: detailMessage || '',
        stack: stackMessage || '',
        description: description || ''
      };
      return atom.notifications.addError(message, notificationOptions);
    }
  }

  handleSuccess(
    message,
    {
      detail = null,
      description = null,
      showNotification = true,
      showConsoleMessage = true,
      notificationAutoDismiss = false,
      notificationButtons = []
    } = {}
  ) {
    const addedButtons = this.processButtons(notificationButtons);
    const detailMessage = this.joinMessageArray(detail);

    if (showConsoleMessage) {
      this.consoleService.log(`${message}${detailMessage ? `\n${detailMessage}` : ''}`);
    }
    if (showNotification && typeof (message) === 'string') {
      const notificationOptions = {
        ...addedButtons,
        dismissable: !notificationAutoDismiss,
        detail: detailMessage || '',
        description: description || ''
      };
      return atom.notifications.addSuccess(message, notificationOptions);
    }
  }

  handleCredentialsMissing(errorNotification) {
    const n = atom.notifications.addError(
      'Copy and paste the Streaming Analytics service credentials into the build-ibmstreams package settings page.',
      {
        dismissable: true,
        buttons: [{
          text: 'Open package settings',
          onDidClick: () => {
            this.dismissNotification(errorNotification);
            this.dismissNotification(n);
            atom.workspace.open('atom://config/packages/build-ibmstreams');
          }
        }]
      }
    );
    return n;
  }

  processButtons(btns) {
    const buttons = {};
    if (Array.isArray(btns)) {
      buttons.buttons = btns.map(obj => ({ onDidClick: obj.callbackFn, text: obj.label }));
    }
    return buttons;
  }

  joinMessageArray(msgArray) {
    if (Array.isArray(msgArray)) {
      return msgArray.join('\n').trimRight();
    }
    return msgArray;
  }

  dismissNotification(notification) {
    if (notification && typeof (notification.dismiss) === 'function') {
      notification.dismiss();
    }
  }

  getLoggableMessage(messages: Array<any>) {
    return this.joinMessageArray(messages.map(outputMsg => outputMsg.message_text));
  }
}
