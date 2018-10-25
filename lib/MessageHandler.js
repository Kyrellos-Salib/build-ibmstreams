// @flow

"use strict";
"use babel";

export class MessageHandler {
	consoleService: null;

	constructor(service) {
		this.consoleService = service;
	}

	handleBuildProgressMessage(messageOutput: Array<any> | string, showNotification?: boolean) {
		if (Array.isArray(messageOutput)) {
			const message = this.getLoggableMessage(messageOutput);
			if (message) {
				this.consoleService.log(message);
				if (showNotification) {
					atom.notifications.addInfo("building...", {detail: message});
				}
			}
		} else if (typeof(messageOutput) === "string") {
			this.consoleService.log(messageOutput);
			if (showNotification) {
				atom.notifications.addInfo(messageOutput, {});
			}
		}
		// if (input && input.output) {
		// 	const messageText = input.output
		// 		.map(outputMsg => outputMsg.message_text)
		// 		.join("\n");
		// 	if (input.status === "building" || input.status === "waiting") {
		// 		atom.notifications.addInfo(input.status+"...", {detail: messageText});
		// 	}
		// } else if (typeof(input) === "string") {
		// 	this.consoleService.log(input);
		// 	if (showNotification) {
		// 		atom.notifications.addInfo(input, {});
		// 	}
		// }
	}

	handleBuildSuccess(messageOutput: Array<any>) {
		const message = this.getLoggableMessage(messageOutput);
		if (message) {
			this.consoleService.log(message);
			atom.notifications.addSuccess("Build succeeded", {detail: message, dismissable: true});
		} else {
			this.consoleService.log("Build succeeded");
			atom.notifications.addSuccess("Build succeeded", {dismissable: true});
		}
	}

	handleBuildFailure(messageOutput: Array<any>) {
		const message = this.getLoggableMessage(messageOutput);
		if (message) {
			this.consoleService.error(message);
			atom.notifications.addError("Build failed", {detail: message, dismissable: true});
		} else {
			this.consoleService.error("Build failed");
			atom.notifications.addError("Build failed", {dismissable: true});
		}
	}

	handleSubmitProgressMessage(input) {

	}

	handleSubmitSuccess(input) {
		atom.notifications.addSuccess(`Job ${input.name} is ${input.health}`, {dismissable: true});

		if (this.consoleService) {
			this.consoleService.log(`Job ${input.name} is ${input.health}`);
		}
	}

	handleSubmitFailure(input) {
		const errorString = input.errors.map(err => err.message).join("\n");
		atom.notifications.addError(`Job submission failed`, {detail: errorString, dismissable: true});

		if (this.consoleService) {
			this.consoleService.error(`Job submission failed\n${errorString}`);
		}
	}
	handleError(input) {
		if (typeof(input) === "string") {
			atom.notifications.addError(input, {dismissable: true});
		} else if (input.message) {
			atom.notifications.addError(
				input.message,
				{detail: input.stack, stack: input.stack}
			);
		}
		console.error(input);
	}
	handleSuccess(input, detail, showNotification, showConsoleMsg) {
		if (showNotification) {
			atom.notifications.addSuccess(input, {detail: detail, dismissable: true});
		}
		if (showConsoleMsg) {
			if (this.consoleService) {
				this.consoleService.log(`${input}\n${detail}`);
			}
		}
	}

	handleWarning(message) {
		if (message && typeof(message) === "string") {
			this.consoleService.warn(message);
			atom.notifications.addWarning(message, {});
		}
	}

	showDialog(message, detail, buttonObjs) {
		const labels = buttonObjs.map(obj => obj.label);
		const callbacks = buttonObjs.map(obj => obj.callbackFn);
		let buttons = {};
		labels.forEach((label, index) => {
			buttons[label] = callbacks[index];
		});
		atom.confirm({message: message, detailedMessage: detail, buttons: buttons});
	}

	getLoggableMessage(messages: Array<any>) {
		return messages
			.map(outputMsg => outputMsg.message_text)
			.join("\n")
			.trimRight();
	}
}
