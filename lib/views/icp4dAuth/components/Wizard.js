'use babel';
'use strict';

import * as React from 'react';
import { connect } from 'react-redux';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import {
  authenticateIcp4d,
  authenticateStreamsInstance
} from '../../../actions';
import StateSelector from '../../../util/state-selectors';
// import Utils from '../utils';

class Wizard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // currentStep: 1,
      // username: 'admin',
      // password: 'password',
      // rememberPassword: true,
      touched: {
        username: false,
        password: false
      },
      isAuthenticating: false,
      authError: false,
      instances: [],
      instance: ''
    };
  }

    componentDidMount = () => {
      // Utils.init(this.setState.bind(this), this.nextStep.bind(this));
    }

    nextStep = () => {
      let currentStep = this.state.currentStep;
      if (currentStep >= 1) {
        currentStep = 2;
      } else {
        currentStep += 1;
      }

      this.setState(
        { currentStep },
        // () => Utils.postSetState(this.state)
      );
    }

    handleChange = e => {
      this.setState(
        { [e.target.name]: e.target.value },
        // () => Utils.postSetState(this.state)
      );
    }

    handleBlur = e => {
      this.setState(
        { touched: { ...this.state.touched, [e.target.name]: true } },
        // () => Utils.postSetState(this.state)
      );
    }

    toggleCheckbox = e => {
      this.setState(
        { [e.target.name]: e.target.checked },
        // () => Utils.postSetState(this.state)
      );
    }

    render() {
      const {
        currentStep,
        closeModal
      } = this.props;
      const {
        // currentStep,
        // username,
        // password,
        // rememberPassword,
        touched,
        // isAuthenticating,
        authError,
        instances,
        instance
      } = this.state;

      return (
        <div>
          <Step1
            currentStep={currentStep}
            onNext={this.nextStep}
            onChange={this.handleChange}
            onBlur={this.handleBlur}
            onCheckboxChange={this.toggleCheckbox}
            // onCredentialsSubmit={authenticateIcp4d}
            // password={password}
            // rememberPassword={rememberPassword}
            touched={touched}
            // isAuthenticating={isAuthenticating}
            authError={authError}
          />
          <Step2
            currentStep={currentStep}
            onNext={this.nextStep}
            onChange={this.handleChange}
            onInstanceSubmit={authenticateStreamsInstance}
            instances={instances}
            instance={instance}
          />
          <Step3
            currentStep={currentStep}
            closeModal={closeModal}
          />
        </div>
      );
    }
}

const mapStateToProps = (state) => {
  return {
    currentStep: StateSelector.getCurrentLoginStep(state) || 1
  };
};

export default connect(
  mapStateToProps,
  { authenticateIcp4d, authenticateStreamsInstance }
)(Wizard);
