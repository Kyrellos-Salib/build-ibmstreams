'use babel';
'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { Content } from 'carbon-components-react/lib/components/UIShell';
import {
  TextInput,
  Button,
  Form,
  FormGroup
} from 'carbon-components-react';

export default class SubmissionTimeView {
  constructor(getStore, closePanel) {
    this.element = document.createElement('div');
    this.getStore = getStore;
    const inputs = [];
    const inputStyle = {
      margin: '30px',
      float: 'left',
    };
    for (let i = 0; i < 20; i += 1) {
      const label = `label ${i}`;
      inputs[i] = (
        <div style={inputStyle}>
          {label}
          <TextInput defaultValue="test" type="text" />
        </div>
      );
    }
    this.textInputs = React.createElement('div', [], inputs);
    this.closePanel = closePanel;
    this.render();
  }

  render() {
    const buttonStyle = {
      margin: '5px'
    };
    const divStyle = {
      overflow: 'auto',
      'max-height': '80vh',
    };
    ReactDOM.render(
      <Content>
        <h1>Submission time paramters</h1>
        <Form>
          <FormGroup style={divStyle}>
            {this.textInputs}
          </FormGroup>
          <Button type="reset" onClick={this.closePanel} style={buttonStyle}>Close</Button>
          <Button type="reset">clear</Button>
          <Button type="submit">submit</Button>
        </Form>
      </Content>,
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
