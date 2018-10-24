// @flow
"use strict";
"use babel";

export class LintHandler {

	linter = null;
	msgRegex = null;
	appRoot = null;

	constructor(linter, msgRegex, appRoot) {
		this.linter = linter;
		this.msgRegex = msgRegex;
		this.appRoot = appRoot;
	}


	lint(input) {
		if (!this.linter || !input) {
			return;
		}

		if (input.output && Array.isArray(input.output)) {
			let convertedMessages = input.output.map(
			(message) => message.message_text
			).filter(
			// filter only messages that match expected format
			(msg) => msg.match(this.msgRegex)
			).map(
			(msg) => {
				// return objects for each message
				let parts = msg.match(this.msgRegex);
				let severityCode = parts[4].trim().substr(parts[4].trim().length - 1);
				let severity = "info";
				if (severityCode) {
					switch (severityCode) {
						case "I":
							severity = "info";
							break;
						case "W":
							severity = "warning";
							break;
						case "E":
							severity = "error";
							break;
						default:
							break;
					}
				}
				let absolutePath = parts[1];
				if (this.appRoot && typeof(this.appRoot) === "string") {
					absolutePath = `${this.appRoot}/${parts[1]}`;
				}

				return {
					severity: severity,
					location: {

						file: absolutePath,
						position: [[parts[2]-1,parts[3]-1],[parts[2]-1,parts[3]]], // 0-indexed
					},
					excerpt: parts[4],
					description: parts[5],
				};
			}
			);

			this.linter.setAllMessages(convertedMessages);

		}
	}
}
