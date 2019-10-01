'use babel';
'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { Content } from 'carbon-components-react/lib/components/UIShell';
import {
  TextInput,
  Button,
  Form,
  FormGroup,
} from 'carbon-components-react';
import Collapsible from 'react-collapsible';
import * as style from './style';
import { submitFromBundleWithParams } from '../../actions';

export default class SubmissionTimeView {
  constructor(getStore, closePanel, submissionTimeValues, submissionObservableFunc, submissionObservableInput, submitFunc, bundleId) {
    this.element = document.createElement('div');
    this.state = {
      isCollapsed: false
    };
    this.submissionParams = {};
    this.getStore = getStore;
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.bundleId = bundleId;
    let inputs = [];
    const sections = [];
    let isFirst = true;
    let title;
    submissionTimeValues.sort((a, b) => a.attr.index - b.attr.index);
    const boolComposites = {};
    let sec = 0;
    let name;
    let compositeName;
    for (let i = 0, item = 0; i < submissionTimeValues.length; i += 1, item += 1) {
      compositeName = submissionTimeValues[i].attr.compositeName;
      let defaultValue = submissionTimeValues[i].attr.defaultValue;
      name = submissionTimeValues[i].attr.name;
      if (defaultValue) {
        defaultValue = defaultValue.replace(/^"/, '');
        defaultValue = defaultValue.replace(/"$/, '');
        this.submissionParams[`${compositeName}.${name}`] = {
          name: `${compositeName}.${name}`,
          value: defaultValue
        };
      }
      if (!boolComposites[compositeName]) {
        if (!isFirst) {
          sections[sec] = React.createElement(Collapsible, {
            trigger: title,
            open: true,
            key: `${compositeName}${name}`,
          }, inputs);
          sec += 1;
          item = 0;
          inputs = [];
        } else {
          isFirst = false;
        }
        title = <h2 className="block stvHover" style={style.h2Style}>{compositeName}</h2>;
        boolComposites[compositeName] = true;
      }
      inputs[item] = (
        <div style={style.inputDivStyle} key={`${compositeName}${name}`}>
          <h3 className="svtH3">{name}</h3>
          <TextInput name={`${compositeName}~--~${name}`} className="input-text" id={`${compositeName}${name}`} defaultValue={defaultValue} required placeholder="input value" onChange={this.handleChange} style={style.inputSyle} />
        </div>
      );
    }
    sections[sec] = React.createElement(Collapsible, {
      trigger: title,
      open: true,
      key: `${compositeName}${name}`,
    }, inputs);
    this.textInputs = React.createElement('div', [], sections);
    this.closePanel = closePanel;
    this.submitFunc = submitFunc;
    this.submissionObservableFunc = submissionObservableFunc;
    this.submissionObservableInput = submissionObservableInput;
    this.render();
  }

  setSubmissionParams(index, value) {
    this.submissionParams[index] = value;
  }

  handleChange(event) {
    this.setSubmissionParams(event.target.name, { name: event.target.name, value: event.target.value });
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
    return this.submissionParams;
  }
}
