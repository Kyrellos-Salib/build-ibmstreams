'use babel';
'use strict';

import * as React from 'react';
import {
  Alert, Button, Form
} from 'react-bootstrap';
import ReactLoading from 'react-loading';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  authenticateIcp4d,
  setFormDataField
} from '../../../actions';
import StateSelector from '../../../util/state-selectors';
// import './Step1.css';

class Step1 extends React.Component {
  constructor(props) {
    super(props);

    console.log('Step1 constructor props:', props);

    this.state = {
      isAuthenticating: false,
    };

    this.renderErrorHeader = this.renderErrorHeader.bind(this);
    this.renderLoadingSpinner = this.renderLoadingSpinner.bind(this);
    this.onTextChange = this.onTextChange.bind(this);
    this.onCheckboxChange = this.onCheckboxChange.bind(this);
  }

  validate = (username, password) => ({
    username: username.length === 0,
    password: password.length === 0
  });

  onTextChange(e) {
    const { updateFormDataField } = this.props;
    updateFormDataField(e.target.name, e.target.value);
  }

  onCheckboxChange(e) {
    const { updateFormDataField } = this.props;
    updateFormDataField(e.target.name, e.target.checked);
  }

  static getDerivedStateFromProps(props, currentState) {
    console.log('getDerivedStateFromProps - props:', props);
    console.log('getDerivedStateFromProps - currentState:', currentState);
    const { hasAuthenticated } = props;
    const { isAuthenticating } = currentState;
    console.log('in getDerivedStateFromProps', props, currentState);
    let newState = null;
    if (hasAuthenticated && isAuthenticating) {
      newState = { isAuthenticating: false };
    }
    return newState;
  }

  renderErrorHeader() {
    const { authError } = this.state;
    if (authError) {
      return (
        <Alert dismissible variant="danger">
          Incorrect username or password.
        </Alert>
      );
    }
    return null;
  }

  renderLoadingSpinner() {
    const { isAuthenticating } = this.state;
    return isAuthenticating ? (<ReactLoading className="loadingSpinner" type="spin" height="10%" width="10%" />) : null;
  }

  render() {
    const {
      currentStep,
      username,
      password,
      rememberPassword,
      touched,
      // isAuth,
      authError,
      onChange,
      onBlur,
      onCheckboxChange,
      // onCredentialsSubmit,
      // setUser,
      authenticate,
      onNext,
      hasAuthenticated
    } = this.props;

    if (currentStep !== 1) {
      return null;
    }

    const errors = this.validate(username, password);

    const isEnabled = !Object.keys(errors).some(field => errors[field]);

    return (
      <div className="native-key-bindings">
        {this.renderErrorHeader()}

        {this.renderLoadingSpinner()}

        <Form>
          <Form.Group controlId="formUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              // className="native-key-bindings"
              // className={showError(errors, touched, 'username') ? 'errorInput' : ''}
              size="sm"
              type="text"
              name="username"
              placeholder="Your username"
              // tabIndex="-100"
              ref={e => this.usernameInput = e}
              onBlur={onBlur}
              onChange={this.onTextChange}
              // onKeyPress={this.onKeyPress}
              value={username}
            />
          </Form.Group>

          <Form.Group controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              // className="native-key-bindings"
              // className={showError(errors, touched, 'password') ? 'errorInput' : ''}
              size="sm"
              type="password"
              name="password"
              placeholder="Your password"
              // tabIndex="-99"
              onBlur={onBlur}
              onChange={this.onTextChange}
              // onKeyPress={this.onKeyPress}
              value={password}
            />
          </Form.Group>

          <Form.Group controlId="formCheckbox">
            <Form.Check
              // className="native-key-bindings"
              name="rememberPassword"
              checked={rememberPassword}
              // tabIndex="-98"
              type="checkbox"
              label="Remember my password"
              onChange={this.onCheckboxChange}
            />
          </Form.Group>

          {/* <br /> */}

          <Button
            variant="primary"
            size="sm"
            type="submit"
            disabled={!isEnabled}
            onClick={
              () => {
                this.setState({ isAuthenticating: true });
                authenticate(username, password, rememberPassword);
              }
            }
          >
            Log in
          </Button>
        </Form>
      </div>
    );
  }
}

const showError = (errors, touched, field) => {
  const hasError = errors[field];
  const shouldShow = touched[field];
  return hasError ? shouldShow : false;
};

const mapStateToProps = (state) => {
  let username = StateSelector.getFormUsername(state);
  if (typeof username !== 'string') {
    username = StateSelector.getUsername(state) || '';
  }
  let rememberPassword = StateSelector.getFormRememberPassword(state);
  if (typeof rememberPassword !== 'boolean') {
    rememberPassword = StateSelector.getRememberPassword(state);
    if (typeof rememberPassword !== 'boolean') {
      rememberPassword = true;
    }
  }
  const password = StateSelector.getFormPassword(state) || '';

  return {
    loginFormInitialized: StateSelector.getLoginFormInitialized(state) || false,
    username,
    password,
    rememberPassword,
    hasAuthenticated: StateSelector.hasAuthenticatedIcp4d(state) || false,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    authenticate: (username, password, rememberPassword) => dispatch(authenticateIcp4d(username, password, rememberPassword)),
    updateFormDataField: (key, value) => dispatch(setFormDataField(key, value))
  };
};

Step1.propTypes = {
  authenticate: PropTypes.func.isRequired,
  updateFormDataField: PropTypes.func.isRequired,

  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  rememberPassword: PropTypes.bool.isRequired,
  currentStep: PropTypes.number.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Step1);
