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

import * as style from './style';

export default class SubmissionTimeView {
  constructor(getStore, closePanel, submissionTimeValues, submissionObservableFunc, submissionObservableInput, submitFunc) {
    this.element = document.createElement('div');
    this.state = {};
    this.getStore = getStore;
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    const inputs = [];
    submissionTimeValues.sort((a, b) => a.attr.index - b.attr.index);
    for (let i = 0; i < submissionTimeValues.length; i += 1) {
      const compositeName = `composite name:\n${submissionTimeValues[i].attr.compositeName} `;
      let defaultValue = submissionTimeValues[i].attr.defaultValue;
      const name = submissionTimeValues[i].attr.name;
      if (defaultValue) {
        defaultValue = defaultValue.replace(/"/g, '');
        this.state[`${compositeName}${name}`] = {
          name,
          value: defaultValue
        };
      }
      inputs[i] = (
        <div style={style.inputDivStyle} key={`${compositeName}${name}`}>
          <TextInput name={`${compositeName}${name}`} id={`${compositeName}${name}`} defaultValue={defaultValue} labelText={name} required placeholder="input value" helperText={compositeName} onChange={this.handleChange} style={style.inputSyle} />
        </div>
      );
    }
    this.textInputs = React.createElement('div', [], inputs);
    this.closePanel = closePanel;
    this.submitFunc = submitFunc;
    this.submissionObservableFunc = submissionObservableFunc;
    this.submissionObservableInput = submissionObservableInput;
    this.render();
  }

  setState(index, value) {
    this.state[index] = value;
  }

  handleChange(event) {
    this.setState(event.target.name, { name: event.target.name.split(' ').slice(-1)[0], value: event.target.value });
  }

  handleSubmit(event) {
    const params = [];
    const state = this.getSubmissionTimeParams();
    Object.keys(state).forEach(key => {
      params.push(state[key]);
    });
    this.submissionObservableInput.submissionTimeValues = JSON.stringify(params);
    this.submitFunc(this.submissionObservableFunc, this.submissionObservableInput);
    this.closePanel();
  }

  render() {
    ReactDOM.render(
      <Content>
        <h1>Submission time paramters</h1>
        <Form className="native-key-bindings" onSubmit={this.handleSubmit}>
          <FormGroup style={style.formStyle} legendText="">
            {this.textInputs}
          </FormGroup>
          <Button style={style.submitButtonStyle} type="submit" size="small">Submit</Button>
          <Button type="reset" onClick={this.closePanel} style={style.buttonStyle} size="small">Cancel</Button>
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

  getSubmissionTimeParams() {
    return this.state;
  }
}
