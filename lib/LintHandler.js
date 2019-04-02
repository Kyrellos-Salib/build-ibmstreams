'use babel';
'use strict';

import StreamsUtils from './util/streams-utils';

export default class LintHandler {
  linter = null;

  msgRegex = null;

  appRoot = null;

  constructor(linter, msgRegex, appRoot) {
    this.linter = linter;
    this.msgRegex = StreamsUtils.SPL_MSG_REGEX;
    this.appRoot = appRoot;
  }


  lint(input) {
    if (!this.linter || !input) {
      return;
    }

    if (input.output && Array.isArray(input.output)) {
      const convertedMessages = input.output.map(
        (message) => message.message_text
      ).filter(
        // filter only messages that match expected format
        (msg) => msg.match(this.msgRegex)
      ).map(
        (msg) => {
          // return objects for each message
          const parts = msg.match(this.msgRegex);
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
      );

      this.linter.setAllMessages(convertedMessages);

      if (Array.isArray(convertedMessages) && convertedMessages.length > 0) {
        atom.workspace.open('atom://nuclide/diagnostics');
      }
    }
  }
}
