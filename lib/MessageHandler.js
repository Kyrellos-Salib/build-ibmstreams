// @flow

"use strict";
"use babel";

import path from "path";

const packageRoot = atom.packages.resolvePackagePath("build-ibmstreams");
const STREAMING_ANALYTICS_ICON_PATH = `${packageRoot}${path.sep}assets${path.sep}streaming_analytics_200x200.png`;

export class MessageHandler {
	consoleService: null;

	constructor(service) {
		this.consoleService = service;
	}

	handleInfoMessage(
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
			this.consoleService.log(`${message}${detailMessage ? "\n"+detailMessage: ""}`);
		}
		if (showNotification && typeof(message) === "string") {
			const notificationOptions = {
				...addedButtons,
				dismissable: !notificationAutoDismiss,
				detail: detailMessage ? detailMessage : "",
				description: description ? description : ""
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
			if (typeof(detailMessage) === "string" && detailMessage.length > 0) {
				this.consoleService.error(detailMessage);
			}
		}
		if (showNotification && typeof(message) === "string") {
			const notificationOptions = {
				...addedButtons,
				dismissable: !notificationAutoDismiss,
				detail: detailMessage ? detailMessage : "",
				stack: stackMessage ? stackMessage: "",
				description: description ? description : ""
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
			this.consoleService.log(`${message}${detailMessage ? "\n"+detailMessage: ""}`);
		}
		if (showNotification && typeof(message) === "string") {
			const notificationOptions = {
				...addedButtons,
				dismissable: !notificationAutoDismiss,
				detail: detailMessage ? detailMessage : "",
				description: description ? description : ""
			};
			return atom.notifications.addSuccess(message, notificationOptions);
		}
	}

	showDialog(message, detail, buttonObjs) {
		const nativeImage = require("electron").nativeImage;

		const labels = buttonObjs.map(obj => obj.label);
		const callbacks = buttonObjs.map(obj => obj.callbackFn);
		let buttons = {};
		labels.forEach((label, index) => {
			buttons[label] = callbacks[index];
		});
		console.log("MessageHandler.showDialog() - input:\nmessage:",message,"\ndetail:",detail,"\nbuttonLabels:",labels,"\nbuttonCallbacks:",callbacks);
		console.log("MessageHandler.showDialog() - before atom.confirm()");
		atom.confirm(
			{
				message: message,
				detail: detail,
				buttons: labels,
				icon: STREAMING_ANALYTICS_ICON_PATH
			},
			(chosen, checkboxChecked) => {
				const callback = callbacks[chosen];
				if (typeof(callback) === "function") {
					return callback();
				}
			}
		);
		console.log("MessageHandler.showDialog() - after atom.confirm()");
	}

	handleCredentialsMissing(errorNotification) {
		const n = atom.notifications.addError(
			"Copy and paste the Streaming Analytics service credentials into the build-ibmstreams package settings page.",
			{
				dismissable: true,
				buttons: [{
					text: "Open package settings",
					onDidClick: () => {
						this.dismissNotification(errorNotification);
						this.dismissNotification(n);
						atom.workspace.open("atom://config/packages/build-ibmstreams");
					}
				}]
			}
		);
		return n;
	}

	processButtons(btns) {
		let buttons = {};
		if (Array.isArray(btns)) {
			buttons.buttons = btns.map(obj => ({onDidClick: obj.callbackFn, text: obj.label}));
		}
		return buttons;
	}

	joinMessageArray(msgArray) {
		if (Array.isArray(msgArray)) {
			return msgArray.join("\n").trimRight();
		}
		return msgArray;
	}

	dismissNotification(notification) {
		if (notification && typeof(notification.dismiss) === "function") {
			notification.dismiss();
		}
	}

	getLoggableMessage(messages: Array<any>) {
		return this.joinMessageArray(messages.map(outputMsg => outputMsg.message_text));
	}
}
