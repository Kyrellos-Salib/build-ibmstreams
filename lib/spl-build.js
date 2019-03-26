'use babel';
'use strict';


import * as fs from 'fs';
import path from 'path';

import * as electron from 'electron';
import { CompositeDisposable } from 'atom';

import MessageHandler from './MessageHandler';
import LintHandler from './LintHandler';
import { SplBuilder } from './spl-build-common';
import { MainCompositePickerView } from './views/MainCompositePickerView';

import KeychainUtils from './util/keychain-utils';
import StreamsUtils from './util/streams-utils';
import SourceArchiveUtils from './util/source-archive-utils';
import StreamsToolkitUtils from './util/streams-toolkits-utils';
import {
  setIcp4dUrl,
  newBuild,
  submitApplicationsFromBundleFiles,
  setToolkitsCacheDir,
  setToolkitsPathSetting,
  setUsername,
  setRememberPassword,
  setFormDataField,
  setBuildOriginator
} from './actions';
import getStore from './redux-store/configure-store';
import MessageHandlerRegistry from './message-handler-registry';
import StateSelector from './util/state-selectors';

import { version } from '../package.json';

import Icp4dAuthenticationView from './views/icp4dAuth/Icp4dAuthenticationView';

const CONF_TOOLKITS_PATH = 'ide-ibmstreams.toolkitsPath';
const CONF_STREAMING_ANALYTICS_CREDENTIALS = 'build-ibmstreams.streamingAnalyticsCredentials';
const CONF_ICP4D_URL = 'build-ibmstreams.icp4dUrl';
const CONF_API_VERSION = 'build-ibmstreams.buildApiVersion';
const CONF_API_VERSION_V4 = 'v4';
const CONF_API_VERSION_V5 = 'v5';

function updateIcp4dUrl(urlString) {
  try {
    const url = new URL(urlString); /* eslint-disable-line compat/compat */
    const prunedUrl = `${url.protocol}//${url.host}`;
    getStore().dispatch(setIcp4dUrl(prunedUrl));
  } catch (err) {
    getStore().dispatch(setIcp4dUrl(null));
  }
}

export default {

  config: {
    streamingAnalyticsCredentials: {
      type: 'string',
      default: '',
      description: 'Credentials for an IBM Streaming Analytics service.'
    },
    icp4dUrl: {
      title: 'IBM Cloud Private for Data url',
      type: 'string',
      default: '',
      description: 'Url for IBM Cloud Private for Data - [Refresh toolkits](atom://build-ibmstreams/toolkits/refresh)'
    },
    buildApiVersion: {
      title: 'Build and submit system',
      type: 'string',
      default: CONF_API_VERSION_V5,
      enum: [
        { value: CONF_API_VERSION_V4, description: 'IBM Cloud Streaming Analytics service' },
        { value: CONF_API_VERSION_V5, description: 'IBM Cloud Private for Data Streams addon' }
      ]
    }
  },

  subscriptions: null,
  storeSubscription: null,
  mainCompositeSelectorPanel: null,
  mainCompositePickerView: null,
  icp4dAuthenticationPanel: null,
  icp4dAuthenticationView: null,

  linterService: null,
  consoleService: null,
  treeView: null,

  lintHandler: null,
  messageHandler: null,
  openUrlHandler: null,
  splBuilder: null,

  streamingAnalyticsCredentials: null,
  appRoot: null,
  toolkitRoot: null,
  action: null,
  apiVersion: null,

  initialize(state) { },

  activate(state) {
    console.log('spl-build:activate');

    this.subscriptions = new CompositeDisposable();

    this.registerCommands();
    this.registerContextMenu();

    this.subscriptions.add(
      atom.config.onDidChange(CONF_ICP4D_URL, {}, (event) => {
        try {
          const parsedUrl = new URL(event.newValue); // eslint-disable-line compat/compat
          updateIcp4dUrl(parsedUrl);
        } catch (err) { /* do nothing */ }
      })
    );
    this.subscriptions.add(
      atom.config.onDidChange(CONF_API_VERSION, {}, (event) => {
        this.apiVersion = event.newValue;
      })
    );
    this.apiVersion = atom.config.get(CONF_API_VERSION);

    if (!StateSelector.getIcp4dUrl(getStore().getState())) {
      updateIcp4dUrl(atom.config.get(CONF_ICP4D_URL));
    }

    this.storeSubscription = getStore().subscribe(() => {
      console.log('Store subscription updated state: ', getStore().getState());
    });

    this.openUrlHandler = url => electron.shell.openExternal(url);
    MessageHandlerRegistry.setOpenUrlHandler(this.openUrlHandler);

    this.mainCompositePickerView = new MainCompositePickerView(this.handleBuildCallback.bind(this), this.handleCancelCallback.bind(this));
    this.mainCompositeSelectorPanel = atom.workspace.addTopPanel({
      item: this.mainCompositePickerView.getElement(),
      visible: false
    });

    this.icp4dAuthenticationView = new Icp4dAuthenticationView(getStore(), () => {
      this.icp4dAuthenticationPanel.hide();
    });
    this.icp4dAuthenticationPanel = atom.workspace.addRightPanel({
      item: this.icp4dAuthenticationView.getElement(),
      visible: false
    });

    this.initializeToolkitCache();

    if (state) {
      console.log('package activation state: ', state);
      if (state.username) {
        getStore().dispatch(setUsername(state.username));
      }
      if (state.rememberPassword) {
        getStore().dispatch(setRememberPassword(state.rememberPassword));
      }
    }

    getStore().dispatch(setBuildOriginator('atom', version));

    getStore().dispatch({ type: 'PACKAGE_ACTIVATED' });

    // const self = this;

  },

  serialize() {
    const username = StateSelector.getUsername(getStore().getState());
    const rememberPassword = StateSelector.getRememberPassword(getStore().getState());
    let serializedData = {};
    serializedData = username ? { ...serializedData, username } : serializedData;
    serializedData = rememberPassword ? { ...serializedData, rememberPassword } : serializedData;
    console.log('package serialize() serializedData: ', serializedData);
    return serializedData;
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

    if (this.icp4dAuthenticationPanel) {
      this.icp4dAuthenticationPanel.destroy();
    }
    if (this.icp4dAuthenticationView) {
      this.icp4dAuthenticationView.destroy();
    }

    this.storeSubscription();
  },

  registerCommands() {
    this.subscriptions.add(
      atom.commands.add('atom-workspace', 'spl-build:build-submit', {
        displayName: 'IBM Streams: Build application and submit a job',
        description: 'Build a Streams application and submit job to the Streams instance',
        didDispatch: () => this.buildApp(SplBuilder.BUILD_ACTION.SUBMIT)
      }),
      atom.commands.add('atom-workspace', 'spl-build:build-download', {
        displayName: 'IBM Streams: Build application and download application bundle',
        description: 'Build Streams application and download the compiled application bundle',
        didDispatch: () => this.buildApp(SplBuilder.BUILD_ACTION.DOWNLOAD)
      }),
      atom.commands.add('atom-workspace', 'spl-build:build-make-submit', {
        displayName: 'IBM Streams: Build application(s) and submit job(s)',
        description: 'Build Streams application(s) and submit job(s) to the Streams instance',
        didDispatch: () => this.buildMake(SplBuilder.BUILD_ACTION.SUBMIT)
      }),
      atom.commands.add('atom-workspace', 'spl-build:build-make-download', {
        displayName: 'IBM Streams: Build application(s) and download application bundle(s)',
        description: 'Build Streams application(s) and download the compiled application bundle(s)',
        didDispatch: () => this.buildMake(SplBuilder.BUILD_ACTION.DOWNLOAD)
      }),
      atom.commands.add('atom-workspace', 'spl-build:submit', {
        displayName: 'IBM Streams: Submit application bundle to the Streams instance',
        description: 'Submit Streams application to the Streams instance',
        didDispatch: () => this.submit()
      }),
      atom.commands.add('atom-workspace', 'spl-build:open-streams-console', {
        displayName: 'IBM Streams: Open Streams console',
        description: 'Streams console instance and application management webpage',
        didDispatch: () => this.openConsole()
      }),
      atom.commands.add('atom-workspace', 'spl-build:open-public-cloud-dashboard', {
        displayName: 'IBM Streams: Open IBM Cloud dashboard',
        description: 'IBM Cloud dashboard webpage for managing Streaming Analytics services',
        didDispatch: () => this.openCloudDashboard()
      }),
      atom.commands.add('atom-workspace', 'spl-build:open-icp4d-dashboard', {
        displayName: 'IBM Streams: Open IBM Cloud Private for Data dashboard',
        description: 'IBM Cloud Private for Data dashboard webpage',
        didDispatch: () => this.openIcp4dDashboard()
      }),
    );
  },

  registerContextMenu() {
    this.subscriptions.add(
      atom.contextMenu.add({
        'atom-workspace': [
          {
            type: 'separator'
          },
          {
            label: 'IBM Streams',
            shouldDisplay: self.shouldShowMenu,
            beforeGroupContaining: ['tree-view:open-selected-entry-up'],
            submenu: [
              {
                label: 'Build',
                command: 'spl-build:build-download',
                shouldDisplay: this.shouldShowMenuSpl
              },
              {
                label: 'Build and submit job',
                command: 'spl-build:build-submit',
                shouldDisplay: this.shouldShowMenuSpl
              },
              {
                label: 'Build',
                command: 'spl-build:build-make-download',
                shouldDisplay: this.shouldShowMenuMake
              },
              {
                label: 'Build and submit job(s)',
                command: 'spl-build:build-make-submit',
                shouldDisplay: this.shouldShowMenuMake
              },
              {
                label: 'Submit job',
                command: 'spl-build:submit',
                shouldDisplay: this.shouldShowMenuSubmit
              },
              {
                label: 'Open IBM Cloud Private for Data dashboard',
                command: 'spl-build:open-icpd4-dashboard',
                shouldDisplay: this.shouldShowMenuV5.bind(this)
              },
              {
                label: 'Open IBM Cloud dashboard',
                command: 'spl-build:open-IBM-cloud-dashboard',
                shouldDisplay: this.shouldShowMenuV4.bind(this)
              },
              {
                label: 'Open IBM Streams Console',
                command: 'spl-build:open-streams-console',
                shouldDisplay: this.shouldShowMenu.bind(this)
              }
            ]
          },
          {
            type: 'separator'
          }
        ]
      })
    );
  },

  consumeLinter(registerIndie) {
    this.linterService = registerIndie({
      name: 'SPL Build'
    });
    this.subscriptions.add(this.linterService);
  },

  consumeTreeView(treeView) {
    this.treeView = treeView;
  },

  consumeConsoleView(consumeConsoleService) {
    this.consumeConsoleService = consumeConsoleService;
    MessageHandlerRegistry.setDefault(new MessageHandler(this.consumeConsoleService({ id: 'ibm-streams-build-default', name: 'IBM Streams Build' })));
  },

  consumeToolkitUpdater(consumeInitializeToolkit) {
    console.log('toolkit service consume init', consumeInitializeToolkit);
    this.toolkitInitService = consumeInitializeToolkit;
  },

  shouldShowMenuSpl(event) {
    return !!event.target.innerText.toLowerCase().endsWith('.spl');
  },

  shouldShowMenuMake(event) {
    return event.target.innerText.toLowerCase() === 'makefile';
  },

  shouldShowMenuSubmit(event) {
    return !!event.target.innerText.toLowerCase().endsWith('.sab');
  },

  shouldShowMenu(event) {
    return !!(event.target.innerText.toLowerCase() === 'makefile'
      || event.target.innerText.toLowerCase().endsWith('.spl')
      || event.target.innerText.toLowerCase().endsWith('.sab'));
  },

  shouldShowMenuV4(event) {
    return this.shouldShowMenu(event) && this.apiVersion === CONF_API_VERSION_V4;
  },

  shouldShowMenuV5(event) {
    return this.shouldShowMenu(event) && this.apiVersion === CONF_API_VERSION_V5;
  },

  handleBuildCallback(e) {
    const selectedComp = this.mainCompositePickerView.mainComposite;
    if (selectedComp) {
      this.mainCompositeSelectorPanel.hide();
      const fqn = this.namespace ? `${this.namespace}::${selectedComp}` : `${selectedComp}`;
      try {
        SourceArchiveUtils.buildSourceArchive(
          {
            appRoot: this.appRoot,
            toolkitRootPath: this.toolkitRootDir,
            fqn,
            messageHandler: this.messageHandler
          }
        ).then(
          (filename) => this.splBuilder.build(this.action,
            this.streamingAnalyticsCredentials,
            { filename })
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
    if (this.apiVersion === CONF_API_VERSION_V5) {
      this.buildMakeV5(action);
    } else {
      this.buildMakeV4(action);
    }
  },

  buildMakeV4(action) {
    this.action = action;

    const selectedMakefilePath = this.treeView.selectedPaths()[0];
    // const selectedMakefilePath = atom.workspace.getActivePaneItem().selectedPath;
    this.appRoot = SourceArchiveUtils.getApplicationRoot(atom.project.getPaths(), selectedMakefilePath);
    this.toolkitRootDir = atom.config.get(CONF_TOOLKITS_PATH);
    this.streamingAnalyticsCredentials = atom.config.get(CONF_STREAMING_ANALYTICS_CREDENTIALS);
    this.consoleService = this.consumeConsoleService({ id: selectedMakefilePath, name: selectedMakefilePath });
    this.subscriptions.add(this.consoleService);
    this.messageHandler = new MessageHandler(this.consoleService);
    this.lintHandler = new LintHandler(this.linterService, SplBuilder.SPL_MSG_REGEX, this.appRoot);
    this.splBuilder = new SplBuilder(this.messageHandler, this.lintHandler, this.openUrlHandler, { originator: 'atom', version, type: 'make' });

    atom.workspace.open('atom://nuclide/console');

    try {
      SourceArchiveUtils.buildSourceArchive(
        {
          appRoot: this.appRoot,
          toolkitRootPath: this.toolkitRootDir,
          makefilePath: selectedMakefilePath,
          messageHandler: this.messageHandler
        }
      ).then(
        (filename) => this.splBuilder.build(this.action,
          this.streamingAnalyticsCredentials,
          { filename })
      );
    } finally {
      this.splBuilder.dispose();
    }
  },

  buildMakeV5(action) {
    this.action = action;
    const selectedMakefilePath = this.treeView.selectedPaths()[0];
    this.appRoot = SourceArchiveUtils.getApplicationRoot(atom.project.getPaths(), selectedMakefilePath);
    // this.toolkitRootDir = atom.config.get(CONF_TOOLKITS_PATH);
    // this.streamingAnalyticsCredentials = atom.config.get(CONF_STREAMING_ANALYTICS_CREDENTIALS);
    this.consoleService = this.consumeConsoleService({ id: selectedMakefilePath, name: selectedMakefilePath });
    this.subscriptions.add(this.consoleService);
    const messageHandler = MessageHandlerRegistry.get(selectedMakefilePath);
    if (!messageHandler) {
      this.consoleService = this.consumeConsoleService({ id: selectedMakefilePath, name: selectedMakefilePath });
      this.messageHandler = new MessageHandler(this.consoleService);
      MessageHandlerRegistry.add(selectedMakefilePath, this.messageHandler);
    }
    this.lintHandler = new LintHandler(this.linterService, SplBuilder.SPL_MSG_REGEX, this.appRoot);
    // this.splBuilder = new SplBuilder(this.messageHandler, this.lintHandler, this.openUrlHandler, { originator: 'atom', version, type: 'spl' });

    atom.workspace.open('atom://nuclide/console');
    if (!StateSelector.hasAuthenticatedIcp4d(getStore().getState())) {
      this.showAuthPanel();
    }

    if (StateSelector.hasAuthenticatedToStreamsInstance(getStore().getState())) {
      getStore().dispatch(newBuild(
        {
          appRoot: this.appRoot,
          toolkitRootPath: this.toolkitRootDir,
          makefilePath: selectedMakefilePath,
        }
      ));
    }
  },

  buildApp(action) {
    if (this.apiVersion === CONF_API_VERSION_V5) {
      this.buildAppV5(action);
    } else {
      this.buildAppV4(action);
    }
  },

  buildAppV4(action) {
    this.action = action;

    const selectedFilePath = this.treeView.selectedPaths()[0];
    // const selectedFilePath = atom.workspace.getActivePaneItem().selectedPath;
    const { fqn, mainComposites } = StreamsUtils.getFqnMainComposites(selectedFilePath);

    this.appRoot = SourceArchiveUtils.getApplicationRoot(atom.project.getPaths(), selectedFilePath);
    this.toolkitRootDir = atom.config.get(CONF_TOOLKITS_PATH);
    this.streamingAnalyticsCredentials = atom.config.get(CONF_STREAMING_ANALYTICS_CREDENTIALS);
    const messageHandler = MessageHandlerRegistry.get(fqn);
    if (!messageHandler) {
      this.consoleService = this.consumeConsoleService({ id: fqn, name: fqn });
      this.messageHandler = new MessageHandler(this.consoleService);
      MessageHandlerRegistry.add(fqn, this.messageHandler);
    }
    this.lintHandler = new LintHandler(this.linterService, SplBuilder.SPL_MSG_REGEX, this.appRoot);
    this.splBuilder = new SplBuilder(this.messageHandler, this.lintHandler, this.openUrlHandler, { originator: 'atom', version, type: 'spl' });

    atom.workspace.open('atom://nuclide/console');

    // Only prompt user to pick a main composite if more/less than one main composite are found in the SPL file.
    if (mainComposites.length === 1) {
      try {
        SourceArchiveUtils.buildSourceArchive(
          {
            appRoot: this.appRoot,
            toolkitRootPath: this.toolkitRootDir,
            fqn
          }
        ).then(
          filename => console.log('archive built', filename)
          // (filename) => this.splBuilder.build(this.action,
          //   this.streamingAnalyticsCredentials,
          //   { filename })
        );
      } finally {
        this.splBuilder.dispose();
      }
    } else {
      this.mainCompositePickerView.updatePickerContent(this.namespace, mainComposites);
      this.mainCompositeSelectorPanel.show();
      // handling continued in handleBuildCallback() after user input
    }
  },

  buildAppV5(action) {
    const selectedFilePath = this.treeView.selectedPaths()[0];
    const { fqn, mainComposites } = StreamsUtils.getFqnMainComposites(selectedFilePath);

    this.appRoot = SourceArchiveUtils.getApplicationRoot(atom.project.getPaths(), selectedFilePath);
    this.toolkitRootDir = atom.config.get(CONF_TOOLKITS_PATH);
    // this.streamingAnalyticsCredentials = atom.config.get(CONF_STREAMING_ANALYTICS_CREDENTIALS);
    const messageHandler = MessageHandlerRegistry.get(fqn);
    if (!messageHandler) {
      this.consoleService = this.consumeConsoleService({ id: fqn, name: fqn });
      this.messageHandler = new MessageHandler(this.consoleService);
      MessageHandlerRegistry.add(fqn, this.messageHandler);
    }
    this.lintHandler = new LintHandler(this.linterService, SplBuilder.SPL_MSG_REGEX, this.appRoot);
    this.splBuilder = new SplBuilder(this.messageHandler, this.lintHandler, this.openUrlHandler, { originator: 'atom', version, type: 'spl' });

    atom.workspace.open('atom://nuclide/console');
    if (!StateSelector.hasAuthenticatedIcp4d(getStore().getState())) {
      this.showAuthPanel();
    }

    // Only prompt user to pick a main composite if more/less than one main composite are found in the SPL file.
    if (mainComposites.length === 1) {
      try {
        if (StateSelector.hasAuthenticatedToStreamsInstance(getStore().getState())) {
          getStore().dispatch(newBuild(
            {
              appRoot: this.appRoot,
              toolkitRootPath: this.toolkitRootDir,
              fqn,
            }
          ));
        }
      } finally {
        this.splBuilder.dispose();
      }
    } else {
      this.mainCompositePickerView.updatePickerContent(this.namespace, mainComposites);
      this.mainCompositeSelectorPanel.show();
      // handling continued in handleBuildCallback() after user input
    }
  },

  submitV5() {
    if (StateSelector.hasAuthenticatedIcp4d(getStore().getState())) {
      const selectedFilePaths = this.treeView.selectedPaths();
      const filteredPaths = selectedFilePaths.filter(filePath => filePath.toLowerCase().endsWith('.sab'));
      const bundles = filteredPaths.map(filteredPath => ({
        bundlePath: filteredPath,
        jobGroup: 'default',
        jobName: filteredPath.split(path.sep).pop().split('.sab')[0],
        jobConfig: null, // TODO: pass in job config file
      }));
      getStore().dispatch(submitApplicationsFromBundleFiles(bundles));
    } else {
      this.icp4dAuthenticationPanel.show();
    }
  },

  submitV4() {
    const selectedFilePath = this.treeView.selectedPaths()[0];

    if (!selectedFilePath || !selectedFilePath.toLowerCase().endsWith('.sab')) {
      return;
    }

    const name = path.basename(selectedFilePath).split('.sab')[0];

    let rootDir = path.dirname(selectedFilePath);
    if (path.basename(rootDir) === 'output') {
      rootDir = path.dirname(rootDir);
    }
    this.appRoot = rootDir;

    atom.workspace.open('atom://nuclide/console');

    this.streamingAnalyticsCredentials = atom.config.get(CONF_STREAMING_ANALYTICS_CREDENTIALS);
    this.consoleService = this.consumeConsoleService({ id: name, name });
    this.messageHandler = new MessageHandler(this.consoleService);
    this.lintHandler = new LintHandler(this.linterService, SplBuilder.SPL_MSG_REGEX, this.appRoot);
    this.splBuilder = new SplBuilder(this.messageHandler, this.lintHandler, this.openUrlHandler);

    this.splBuilder.submit(this.streamingAnalyticsCredentials, { filename: selectedFilePath });
  },

  /**
  * Submit a selected .sab bundle file to the instance
  */
  submit() {
    if (this.apiVersion === CONF_API_VERSION_V5) {
      this.submitV5();
    } else {
      this.submitV4();
    }
  },

  showAuthPanel() {
    const username = StateSelector.getFormUsername(getStore().getState()) || StateSelector.getUsername(getStore().getState());
    const rememberPassword = StateSelector.getFormRememberPassword(getStore().getState()) || StateSelector.getRememberPassword(getStore().getState());
    if (username && rememberPassword) {
      KeychainUtils.getCredentials(username).then(password => {
        getStore().dispatch(setFormDataField('password', password));
      });
    }
    this.icp4dAuthenticationPanel.show();
  },

  openConsole() {
    if (this.apiVersion === CONF_API_VERSION_V5) {
      const consoleUrlString = StateSelector.getStreamsConsoleUrl(getStore().getState());
      if (consoleUrlString) {
        try {
          const consoleUrl = new URL(consoleUrlString); /* eslint-disable-line compat/compat */
          this.openUrlHandler(consoleUrl);
        } catch (err) { /* */ }
      }
    } else {
      this.streamingAnalyticsCredentials = atom.config.get(CONF_STREAMING_ANALYTICS_CREDENTIALS);
      this.consoleService = this.consumeConsoleService({ id: name, name });
      this.messageHandler = new MessageHandler(this.consoleService);
      this.lintHandler = new LintHandler(this.linterService, SplBuilder.SPL_MSG_REGEX, this.appRoot);
      this.splBuilder = new SplBuilder(this.messageHandler, this.lintHandler, this.openUrlHandler);
      this.splBuilder.openStreamingAnalyticsConsole(this.streamingAnalyticsCredentials);
    }
  },

  openCloudDashboard() {
    if (this.apiVersion === CONF_API_VERSION_V4) {
      this.streamingAnalyticsCredentials = atom.config.get(CONF_STREAMING_ANALYTICS_CREDENTIALS);
      this.consoleService = this.consumeConsoleService({ id: name, name });
      this.messageHandler = new MessageHandler(this.consoleService);
      this.splBuilder = new SplBuilder(this.messageHandler, null, this.openUrlHandler);
      this.splBuilder.openCloudDashboard();
    }
  },

  openIcp4dDashboard() {
    if (this.apiVersion === CONF_API_VERSION_V5) {
      const icp4dUrlString = StateSelector.getIcp4dUrl(getStore().getState());
      if (icp4dUrlString) {
        try {
          const icp4dUrl = new URL(icp4dUrlString); /* eslint-disable-line compat/compat */
          this.openUrlHandler(`${icp4dUrl}/zen/#/homepage`);
        } catch (err) { /* */ }
      }
    }
  },

  initializeToolkitCache() {
    if (atom.packages.isPackageLoaded('build-ibmstreams')) {
      const toolkitsCacheDir = `${atom.packages.getLoadedPackage('build-ibmstreams').path}${path.sep}toolkitsCache`;
      if (!fs.existsSync(toolkitsCacheDir)) {
        fs.mkdirSync(toolkitsCacheDir);
      }
      getStore().dispatch(setToolkitsCacheDir(toolkitsCacheDir));
    }
  },

  initializeToolkitsDirectory() {
    if (atom.packages.isPackageLoaded('ide-ibmstreams')) {
      const toolkitsDirectory = atom.config.get(CONF_TOOLKITS_PATH);
      if (!fs.existsSync(toolkitsDirectory)) {
        fs.mkdirSync(toolkitsDirectory);
      }
      getStore().dispatch(setToolkitsPathSetting(toolkitsDirectory));
    }
  },

  handleStreamsBuildUri(parsedUri) {
    console.log('build package uri handler: ', parsedUri);
    if (parsedUri.host === 'build-ibmstreams') {
      // Handle a toolkit refresh request
      if (parsedUri.pathname === '/toolkits/refresh') {
        console.log('trigger toolkit refresh now!');
        MessageHandlerRegistry.getDefault().handleInfo('Refreshing toolkits');
        const toolkitsDirectory = atom.config.get(CONF_TOOLKITS_PATH);
        if (typeof toolkitsDirectory === 'string' && toolkitsDirectory.length > 0) {
          if (!fs.existsSync(toolkitsDirectory)) {
            fs.mkdirSync(toolkitsDirectory);
          }
          getStore().dispatch(setToolkitsPathSetting(toolkitsDirectory));
        }
        const toolkitInitOptions = StreamsToolkitUtils.getLangServerOptionForInitToolkits(StateSelector.getToolkitsCacheDir(getStore().getState()), StateSelector.getToolkitsPathSetting(getStore().getState()));
        console.log('toolkit refresh init options', toolkitInitOptions);
        this.toolkitInitService.initializeToolkits(toolkitInitOptions);
      }
    }
  },

};
