'use babel';
'use strict';

import * as React from 'react';
import {
  Alert, Button, Form, ButtonToolbar
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

    this.state = {
      loading: true,
      isAuthenticating: false,
      touched: {
        username: false,
        password: false
      }
    };
  }

  onTextChange = (e) => {
    const { updateFormDataField } = this.props;
    updateFormDataField(e.target.name, e.target.value);
  }

  onCheckboxChange = (e) => {
    const { updateFormDataField } = this.props;
    updateFormDataField(e.target.name, e.target.checked);
  }

  onBlur = (e) => {
    const { touched } = this.state;
    this.setState({
      touched: {
        ...touched,
        [e.target.name]: true
      }
    });
  }

  static getDerivedStateFromProps(props, currentState) {
    const { icp4dAuthError, hasAuthenticatedIcp4d } = currentState;
    if (icp4dAuthError || hasAuthenticatedIcp4d) {
      return ({ isAuthenticating: false });
    }
    return null;
  }

  renderErrorHeader = () => {
    const { icp4dAuthError } = this.state;
    if (!icp4dAuthError) {
      return null;
    }
    switch (icp4dAuthError) {
      case 401:
        return (
          <Alert dismissible variant="danger">
            Incorrect username or password.
          </Alert>
        );
      default:
        return (
          <Alert dismissible variant="danger">
            An error occurred while authenticating.
          </Alert>
        );
    }
  }

  renderLoadingSpinner = () => {
    const { isAuthenticating } = this.state;
    return isAuthenticating ? (
      <ReactLoading className="loadingSpinner" type="spin" height="10%" width="10%" />
    ) : null;
  }

  validate = (username, password) => ({
    username: username.length === 0,
    password: password.length === 0
  });

  showError = (errors, touched, field) => {
    const hasError = errors[field];
    const shouldShow = touched[field];
    return hasError ? shouldShow : false;
  };

  render() {
    const {
      currentStep,
      username,
      password,
      rememberPassword,
      // touched,
      closePanel,
      authError,
      // onChange,
      // onBlur,
      // onCheckboxChange,
      // onCredentialsSubmit,
      // setUser,
      authenticate,
      onNext,
      hasAuthenticated
    } = this.props;

    const {
      loading,
      isAuthenticating,
      touched
    } = this.state;

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
              className={this.showError(errors, touched, 'username') ? 'errorInput' : ''}
              size="sm"
              type="text"
              name="username"
              placeholder="Your username"
              ref={e => this.usernameInput = e}
              onBlur={this.onBlur}
              onChange={this.onTextChange}
              value={username}
            />
          </Form.Group>

          <Form.Group controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              // className="native-key-bindings"
              className={this.showError(errors, touched, 'password') ? 'errorInput' : ''}
              size="sm"
              type="password"
              name="password"
              placeholder="Your password"
              onBlur={this.onBlur}
              onChange={this.onTextChange}
              value={password}
            />
          </Form.Group>

          <Form.Group controlId="formCheckbox">
            <Form.Check
              name="rememberPassword"
              checked={rememberPassword}
              type="checkbox"
              label="Remember my password"
              onChange={this.onCheckboxChange}
            />
          </Form.Group>

          <ButtonToolbar className="justify-content-between">
            <Button
              variant="primary"
              size="sm"
              type="submit"
              disabled={!isEnabled}
              onClick={() => {
                this.setState({ isAuthenticating: true, icp4dAuthError: false });
                authenticate(username, password, rememberPassword);
              }
              }
            >
              Log in
            </Button>
            <Button
              variant="secondary"
              size="sm"
              type="submit"
              onClick={() => closePanel()}
            >
              Cancel
            </Button>
          </ButtonToolbar>

        </Form>
      </div>
    );
  }
}

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
