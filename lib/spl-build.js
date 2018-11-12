// @flow

"use babel";
"use strict";


import * as fs from "fs";
import path from "path";

import * as electron from "electron";
import { CompositeDisposable } from "atom";

import { MessageHandler } from "./MessageHandler";
import { LintHandler } from "./LintHandler";
import { SplBuilder } from "./spl-build-common";
import { MainCompositePickerView } from "./views/MainCompositePickerView";

const CONF_TOOLKITS_PATH = "ide-ibmstreams.toolkitsPath";
const CONF_STREAMING_ANALYTICS_CREDENTIALS = "build-ibmstreams.streamingAnalyticsCredentials";

export default {

	config: {
		streamingAnalyticsCredentials: {
			type: "string",
			default: "",
			description: "Credentials for an IBM Streaming Analytics service."
		}
	},

	subscriptions: null,
	mainCompositeSelectorPanel: null,
	mainCompositePickerView: null,

	linterService: null,
	consoleService: null,

	lintHandler: null,
	messageHandler: null,
	openUrlHandler: null,
	splBuilder: null,

	streamingAnalyticsCredentials: null,
	appRoot: null,
	toolkitRoot: null,
	action: null,

	initialize(state) {

	},

	activate(state) {
		console.log("spl-build:activate");
		this.subscriptions = new CompositeDisposable();
		this.subscriptions.add(
      atom.commands.add(
        "atom-workspace", {
        	"spl-build:build": () => this.buildApp(SplBuilder.BUILD_ACTION.DEFAULT),
        	"spl-build:build-submit": () => this.buildApp(SplBuilder.BUILD_ACTION.SUBMIT),
        	"spl-build:build-download": () => this.buildApp(SplBuilder.BUILD_ACTION.DOWNLOAD),
        	"spl-build:build-make": () => this.buildMake(SplBuilder.BUILD_ACTION.DEFAULT),
        	"spl-build:build-make-submit": () => this.buildMake(SplBuilder.BUILD_ACTION.SUBMIT),
        	"spl-build:build-make-download": () => this.buildMake(SplBuilder.BUILD_ACTION.DOWNLOAD),
        }
      )
		);

		this.openUrlHandler = url => electron.shell.openExternal(url);

		this.mainCompositePickerView = new MainCompositePickerView(this.handleBuildCallback.bind(this), this.handleCancelCallback.bind(this));
		this.mainCompositeSelectorPanel = atom.workspace.addTopPanel({
		 	item: this.mainCompositePickerView.getElement(),
		 	visible: false
		 });

		let toolkitsPath = atom.config.get(CONF_TOOLKITS_PATH, {});

		var self = this;
		this.subscriptions.add(
      atom.contextMenu.add({
      	"atom-workspace": [
      		{
      			type: "separator"
      		},
      		{
      			label: "Streams Build",
      			shouldDisplay: self.shouldShowBuildMenu,
      			beforeGroupContaining: ["tree-view:open-selected-entry-up"],
      			submenu: [
      				{
		      			label: "SPL Build",
		      			command: "spl-build:build",
		      			shouldDisplay: self.shouldShowBuildMenuSpl
		      		},
		      		{
		      			label: "SPL Build and submit job(s)",
		      			command: "spl-build:build-submit",
		      			shouldDisplay: self.shouldShowBuildMenuSpl
		      		},
		      		{
		      			label: "SPL Build and download bundle(s)",
		      			command: "spl-build:build-download",
		      			shouldDisplay: self.shouldShowBuildMenuSpl
		      		},
		      		{
		      			label: "Run Make to build application",
		      			command: "spl-build:build-make",
		      			shouldDisplay: self.shouldShowBuildMenuMake
		      		},
		      		{
		      			label: "Run Make to build application and submit job(s)",
		      			command: "spl-build:build-make-submit",
		      			shouldDisplay: self.shouldShowBuildMenuMake
		      		},
		      		{
		      			label: "Run Make to build application and download bundle(s)",
		      			command: "spl-build:build-make-download",
		      			shouldDisplay: self.shouldShowBuildMenuMake
		      		}
      			]
      		},
      		{
      			type: "separator"
      		}
      	]
      })
		);

	},

	serialize() {

	},

	deactivate() {
		if (this.subscriptions) {
			this.subscriptions.dispose();
		}
		if (this.statusBarTile) {
			this.statusBarTile.destroy();
			this.statusBarTile = null;
		}

		if (this.tooltipDisposable) {
			this.tooltipDisposable.dispose();
		}

		if (this.vcapInputView) {
			this.vcapInputView.destroy();
		}

		if (this.mainCompositeSelectorPanel) {
			this.mainCompositeSelectorPanel.destroy();
		}

		if (this.mainCompositePickerView) {
			this.mainCompositePickerView.destroy();
		}

	},

	consumeLinter(registerIndie) {
		this.linterService = registerIndie({
			name: "SPL Build"
		});
		this.subscriptions.add(this.linterService);
	},

	consumeConsoleView(consumeConsoleService) {
		this.consumeConsoleService = consumeConsoleService;
	},

	shouldShowBuildMenuSpl(event) {
		return event.target.innerText.endsWith(".spl") ? true : false;
	},

	shouldShowBuildMenuMake(event) {
		return event.target.innerText.toLowerCase() === "makefile" ? true : false;
	},

	shouldShowBuildMenu(event) {
		return event.target.innerText.toLowerCase() === "makefile"
			|| event.target.innerText.endsWith(".spl")
			? true : false;
	},

	handleBuildCallback(e)  {
		const selectedComp = this.mainCompositePickerView.mainComposite;
		if (selectedComp) {
			this.mainCompositeSelectorPanel.hide();
			const fqn = this.namespace ? `${this.namespace}::${selectedComp}` : `${selectedComp}`;
			try {
				this.splBuilder.buildSourceArchive(this.appRoot, this.toolkitRootDir, {useMakefile: false, fqn: fqn})
					.then(
						(filename) =>
							this.splBuilder.build( this.action,
								this.streamingAnalyticsCredentials,
								{filename: filename}
							)
					);
			} finally {
				this.splBuilder.dispose();
			}
		}
	},

	handleCancelCallback(e) {
		this.mainCompositeSelectorPanel.hide();
	},

	buildMake(action) {
		this.action = action;

		const selectedMakefilePath = atom.workspace.getActivePaneItem().selectedPath;
		this.appRoot = SplBuilder.getApplicationRoot(atom.project.getPaths(), selectedMakefilePath);
		this.toolkitRootDir = atom.config.get(CONF_TOOLKITS_PATH);
		this.streamingAnalyticsCredentials = atom.config.get(CONF_STREAMING_ANALYTICS_CREDENTIALS);
		this.consoleService = this.consumeConsoleService({id: selectedMakefilePath, name: selectedMakefilePath});
		this.subscriptions.add(this.consoleService);
		this.messageHandler = new MessageHandler(this.consoleService);
		this.lintHandler = new LintHandler(this.linterService, SplBuilder.SPL_MSG_REGEX, this.appRoot);
		this.splBuilder = new SplBuilder(this.messageHandler, this.lintHandler, this.openUrlHandler);

		atom.workspace.open("atom://nuclide/console");

		try {
			this.splBuilder.buildSourceArchive(this.appRoot, this.toolkitRootDir, {useMakefile: true, makefilePath: selectedMakefilePath})
				.then(
					(filename) =>
						this.splBuilder.build( this.action,
							this.streamingAnalyticsCredentials,
							{filename: filename}
						)
				);
		} finally {
			this.splBuilder.dispose();
		}

	},

	buildApp(action) {
		this.action = action;

		const selectedFilePath = atom.workspace.getActivePaneItem().selectedPath;
		let fileContents = "";
		if (selectedFilePath) {
			fileContents = fs.readFileSync(selectedFilePath, "utf-8");
		}

		// Parse selected SPL file to find namespace and main composites
		const namespaces = [];
		while (m = SplBuilder.SPL_NAMESPACE_REGEX.exec(fileContents)) {namespaces.push(m[1])}
		const mainComposites = [];
		while (m = SplBuilder.SPL_MAIN_COMPOSITE_REGEX.exec(fileContents)) {mainComposites.push(m[1])}

		let fqn = "";
		if (namespaces && namespaces.length > 0) {
			fqn = `${namespaces[0]}::`;
			this.namespace = namespaces[0];
		}
		if (mainComposites.length === 1) {
			fqn = `${fqn}${mainComposites[0]}`;
		}

		this.appRoot = SplBuilder.getApplicationRoot(atom.project.getPaths(), selectedFilePath);
		this.toolkitRootDir = atom.config.get(CONF_TOOLKITS_PATH);
		this.streamingAnalyticsCredentials = atom.config.get(CONF_STREAMING_ANALYTICS_CREDENTIALS);
		this.consoleService = this.consumeConsoleService({id: fqn, name: fqn});
		this.messageHandler = new MessageHandler(this.consoleService);
		this.lintHandler = new LintHandler(this.linterService, SplBuilder.SPL_MSG_REGEX, this.appRoot);
		this.splBuilder = new SplBuilder(this.messageHandler, this.lintHandler, this.openUrlHandler);

		atom.workspace.open("atom://nuclide/console");

		// Only prompt user to pick a main composite if more/less than one main composite are found in the SPL file.
		if (mainComposites.length === 1) {
			try {
				this.splBuilder.buildSourceArchive(this.appRoot, this.toolkitRootDir, {useMakefile: false, fqn: fqn})
					.then(
						(filename) =>
							this.splBuilder.build( this.action,
								this.streamingAnalyticsCredentials,
								{filename: filename}
							)
					);
			} finally {
				this.splBuilder.dispose();
			}
		} else {
			this.mainCompositePickerView.updatePickerContent(this.namespace, mainComposites);
			this.mainCompositeSelectorPanel.show();
			// handling continued in handleBuildCallback() after user input
		}
	}

};
