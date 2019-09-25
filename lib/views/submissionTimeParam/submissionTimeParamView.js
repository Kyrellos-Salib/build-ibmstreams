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
import { submitFromBundleWithParams } from '../../actions';

export default class SubmissionTimeView {
  constructor(getStore, closePanel, submissionTimeValues, submissionObservableFunc, submissionObservableInput, submitFunc, bundleId) {
    this.element = document.createElement('div');
    this.state = {};
    this.getStore = getStore;
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.bundleId = bundleId;
    const inputs = [];
    submissionTimeValues.sort((a, b) => a.attr.index - b.attr.index);
    const boolComposites = {};
    for (let i = 0, odd = 0; i < submissionTimeValues.length; i += 1, odd += 1) {
      const compositeName = submissionTimeValues[i].attr.compositeName;
      let defaultValue = submissionTimeValues[i].attr.defaultValue;
      const name = submissionTimeValues[i].attr.name;
      if (defaultValue) {
        defaultValue = defaultValue.replace(/^"/, '');
        defaultValue = defaultValue.replace(/"$/, '');
        this.state[`${compositeName}.${name}`] = {
          name: `${compositeName}.${name}`,
          value: defaultValue
        };
      }
      let inputDivStyle;
      if (odd % 2 === 0) {
        inputDivStyle = { ...style.inputDivStyle, ...style.inputDivOddStyle };
      } else {
        inputDivStyle = { ...style.inputDivStyle };
      }
      if (!boolComposites[compositeName]) {
        odd = 0;
        inputs[i] = (
          <div key={`${compositeName}${name}`}>
            <h2 className="block" style={style.h2Style}>{compositeName}</h2>
            <div style={inputDivStyle} key={`${compositeName}${name}`}>
              <TextInput name={`${compositeName}.${name}`} className="input-text" id={`${compositeName}${name}`} defaultValue={defaultValue} labelText={name} required placeholder="input value" onChange={this.handleChange} style={style.inputSyle} />
            </div>
          </div>
        );
        boolComposites[compositeName] = true;
      } else {
        inputs[i] = (
          <div style={inputDivStyle} key={`${compositeName}${name}`}>
            <TextInput name={`${compositeName}~--~${name}`} className="input-text" id={`${compositeName}${name}`} defaultValue={defaultValue} labelText={name} required placeholder="input value" onChange={this.handleChange} style={style.inputSyle} />
          </div>
        );
      }
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
    this.setState(event.target.name, { name: event.target.name, value: event.target.value });
  }

  handleSubmit(event) {
    const params = [];
    const state = this.getSubmissionTimeParams();
    Object.keys(state).forEach(key => {
      params.push(state[key]);
    });
    if (this.submissionObservableFunc) {
      this.submissionObservableInput.submissionTimeValues = JSON.stringify(params);
      this.submitFunc(this.submissionObservableFunc, this.submissionObservableInput);
    } else {
      const action = submitFromBundleWithParams(this.bundleId, params);
      this.getStore.dispatch((action));
    }
    this.closePanel();
  }

  render() {
    ReactDOM.render(
      <Content>
        <h1>Submission time parameters</h1>
        <Form className="native-key-bindings" onSubmit={this.handleSubmit}>
          <FormGroup style={style.formStyle} legendText="">
            {this.textInputs}
          </FormGroup>
          <Button className="btn btn-sm" type="reset" onClick={this.closePanel} style={style.buttonStyle} size="small">Cancel</Button>
          <Button className="btn btn-primary btn-sm" type="submit" style={style.submitButtonStyle} size="small">Submit</Button>
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
