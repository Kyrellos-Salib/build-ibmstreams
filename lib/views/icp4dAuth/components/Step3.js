'use babel';
'use strict';

import PropTypes from 'prop-types';
import * as React from 'react';
import { Button, Alert } from 'react-bootstrap';
import { connect } from 'react-redux';
import StateSelector from '../../../util/state-selectors';

class Step3 extends React.Component {
  constructor(props) {
    super(props);

    this.renderStreamsAuthError = this.renderStreamsAuthError.bind(this);
    this.renderStreamsAuthSuccess = this.renderStreamsAuthSuccess.bind(this);
    this.renderRestartLogin = this.renderRestartLogin.bind(this);
    this.renderCloseModal = this.renderCloseModal.bind(this);
  }

  renderStreamsAuthError() {
    const {
      streamsAuthError,
      selectedInstanceName
    } = this.props;
    if (!streamsAuthError) {
      return null;
    }
    return (
      <Alert key="StreamsAuthErrorAlert">
        Error authenticating to Streams Instance
        {selectedInstanceName}
      </Alert>
    );
  }

  renderStreamsAuthSuccess() {
    const {
      streamsAuthError,
      selectedInstanceName
    } = this.props;
    if (streamsAuthError) {
      return null;
    }
    return (
      <Alert key="StreamsAuthSuccessAlert" variant="success">
        Successfully authenticated to Streams instance
        {selectedInstanceName}
      </Alert>
    );
  }

  renderRestartLogin() {
    return null;
  }

  renderCloseModal() {
    const {
      closeModal
    } = this.props;
    return (
      <Button
        variant="success"
        onClick={closeModal}
      >
        Close
      </Button>
    );
  }

  render() {
    const {
      currentStep
    } = this.props;
    if (currentStep !== 3) {
      return null;
    }
    return (
      <div className="native-key-bindings">
        {this.renderStreamsAuthError()}
        {this.renderStreamsAuthSuccess()}
        {/* <ButtonGroup> */}
        {this.renderRestartLogin()}
        {this.renderCloseModal()}
        {/* </ButtonGroup> */}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    streamsAuthError: StateSelector.getStreamsAuthError(state) || null,
    selectedInstanceName: StateSelector.getSelectedInstanceName(state) || ''
  };
};

Step3.propTypes = {
  currentStep: PropTypes.number.isRequired,
  selectedInstanceName: PropTypes.string.isRequired,
  // streamsAuthError: PropTypes.string,
  // icp4dAuthError: PropTypes.string,
  closeModal: PropTypes.func.isRequired,
  // restartLogin: PropTypes.func,
};

export default connect(
  mapStateToProps
)(Step3);
