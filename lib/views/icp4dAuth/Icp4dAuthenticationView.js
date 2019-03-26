'use babel';
'use strict';

import { CompositeDisposable, Emitter } from 'atom';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Wizard from './components/Wizard';

export default class Icp4dAuthenticationView {
  constructor(getStore, closeModal) {
    this.element = document.createElement('div');
    this.element.classList.add('icp4d-authentication');
    this.getStore = getStore;
    this.closeModal = closeModal;
    this.render();
  }

  render() {
    ReactDOM.render(
      <Provider store={this.getStore}>
        <div>
          <h1>IBM Cloud Private for Data Settings</h1>
          <br />
          <Wizard closeModal={this.closeModal} />
        </div>
      </Provider>,
      this.element
    );
  }

  destroy() {
    ReactDOM.unmountComponentAtNode(this.element);
  }

  getElement() {
    return this.element;
  }
}
