'use babel';
'use strict';

import { StreamsUtils } from './util';

const CONF_API_VERSION_V4 = 'v4';
const CONF_API_VERSION_V5 = 'v5';

export default class LintHandler {
  linter = null;

  msgRegex = null;

  appRoot = null;

  apiVersion = null;

  constructor(linter, appRoot, apiVersion) {
    this.linter = linter;
    this.appRoot = appRoot;
    this.apiVersion = apiVersion;
    this.msgRegex = apiVersion === CONF_API_VERSION_V4 ? StreamsUtils.SPL_MSG_REGEX : StreamsUtils.SPL_MSG_REGEX_V5;
  }


  lint(input) {
    if (!this.linter || !input) {
      return;
    }
    let messages = [];
    if (this.apiVersion === CONF_API_VERSION_V5) {
      messages = input;
    } else {
      messages = input.output.map(message => message.message_text);
    }

    if (Array.isArray(messages)) {
      const convertedMessages = messages.filter(
        // filter only messages that match expected format
        (msg) => msg.match(this.msgRegex)
      ).map(
        (msg) => {
          // return objects for each message
          const parts = msg.match(this.msgRegex);
          if (parts && parts.length > 4) {
            const severityCode = parts[4].trim().substr(parts[4].trim().length - 1);
            let severity = 'info';
            if (severityCode) {
              switch (severityCode) {
                case 'I':
                  severity = 'info';
                  break;
                case 'W':
                  severity = 'warning';
                  break;
                case 'E':
                  severity = 'error';
                  break;
                default:
                  break;
              }
            }
            let absolutePath = parts[1];
            if (this.appRoot && typeof (this.appRoot) === 'string') {
              absolutePath = `${this.appRoot}/${parts[1]}`;
            }
            return {
              severity,
              location: {
                file: absolutePath,
                position: [
                  [parseInt(parts[2], 10) - 1, parseInt(parts[3], 10) - 1],
                  [parseInt(parts[2], 10) - 1, parseInt(parts[3], 10)]
                ], // 0-indexed
              },
              excerpt: parts[4],
              description: parts[5],
            };
          }
        }
      );

      this.linter.setAllMessages(convertedMessages);

      if (Array.isArray(convertedMessages) && convertedMessages.length > 0) {
        atom.workspace.open('atom://nuclide/diagnostics');
      }
    }
  }
}
