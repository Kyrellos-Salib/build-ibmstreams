'use babel';
'use strict';

const messageHandlerRegistry = {};
const openUrlHandler = {};

function add(identifier, messageHandler) {
  messageHandlerRegistry[identifier] = messageHandler;
}

function remove(identifier) {
  messageHandlerRegistry[identifier] = null;
}

function get(identifier) {
  return messageHandlerRegistry[identifier] || getDefault();
}

function setDefault(messageHandler) {
  messageHandlerRegistry.___default = messageHandler;
}

function getDefault() {
  return messageHandlerRegistry.___default;
}

function setOpenUrlHandler(handler) {
  openUrlHandler.___default = handler;
}
function openUrl(url) {
  openUrlHandler.___default(url);
}

function dispose() {
  Object.keys(messageHandlerRegistry).forEach(k => messageHandlerRegistry[k] = null);
  Object.keys(openUrlHandler).forEach(k => openUrlHandler[k] = null);
}

const MessageHandlerRegistry = {
  add,
  remove,
  get,
  getDefault,
  setDefault,
  openUrl,
  setOpenUrlHandler,
  dispose
};

export default MessageHandlerRegistry;
