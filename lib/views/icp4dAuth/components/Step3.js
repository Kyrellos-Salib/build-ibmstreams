'use babel';
'use strict';

import PropTypes from 'prop-types';
import * as React from 'react';
import { Button, ButtonToolbar, Alert } from 'react-bootstrap';
import { connect } from 'react-redux';
import StateSelector from '../../../util/state-selectors';
import { previousLoginStep } from '../../../actions';

class Step3 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    // this.renderStreamsAuthError = this.renderStreamsAuthError.bind(this);
    // this.renderStreamsAuthSuccess = this.renderStreamsAuthSuccess.bind(this);
    // this.renderRestartLogin = this.renderRestartLogin.bind(this);
    // this.renderCloseModal = this.renderCloseModal.bind(this);
  }

  renderStreamsAuthError = () => {
    const {
      streamsAuthError,
      selectedInstanceName,
      previousStep,
      closePanel
    } = this.props;
    if (!streamsAuthError) {
      return null;
    }
    return (
      <Alert key="StreamsAuthErrorAlert" variant="danger">
        {`Error authenticating to Streams instance ${selectedInstanceName}`}

        <div className="buttonContainer">
          <ButtonToolbar className="justify-content-between">
            <Button
              variant="outline-secondary"
              size="sm"
              type="submit"
              onClick={() => previousStep()}
            >
              Previous
            </Button>

            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => closePanel()}
            >
              Close
            </Button>
          </ButtonToolbar>
        </div>
      </Alert>
    );
  }

  renderStreamsAuthSuccess = () => {
    const {
      streamsAuthError,
      selectedInstanceName,
      previousStep,
      closePanel
    } = this.props;
    if (streamsAuthError) {
      return null;
    }
    return (
      <Alert key="StreamsAuthSuccessAlert" variant="success">
        {`Successfully authenticated to Streams instance ${selectedInstanceName}`}

        <div className="buttonContainer">
          <ButtonToolbar className="justify-content-between">
            <Button
              variant="outline-secondary"
              size="sm"
              type="submit"
              onClick={() => previousStep()}
            >
              Previous
            </Button>

            <Button
              variant="outline-success"
              size="sm"
              onClick={() => closePanel()}
            >
              Close
            </Button>
          </ButtonToolbar>
        </div>
      </Alert>
    );
  }

  // renderRestartLogin() {
  //   return null;
  // }

  // renderCloseModal() {
  //   const {
  //     closeModal
  //   } = this.props;
  //   return (
  //     <Button
  //       variant="success"
  //       onClick={closeModal}
  //     >
  //       Close
  //     </Button>
  //   );
  // }

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

const mapDispatchToProps = (dispatch) => {
  return {
    previousStep: () => dispatch(previousLoginStep())
  };
};

Step3.propTypes = {
  currentStep: PropTypes.number.isRequired,
  selectedInstanceName: PropTypes.string.isRequired,
  // streamsAuthError: PropTypes.string,
  // icp4dAuthError: PropTypes.string,
  closePanel: PropTypes.func.isRequired,
  previousStep: PropTypes.func.isRequired,
  // restartLogin: PropTypes.func,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Step3);
