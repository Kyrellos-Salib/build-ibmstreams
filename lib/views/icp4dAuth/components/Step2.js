'use babel';
'use strict';

import PropTypes from 'prop-types';
import * as React from 'react';
import { Button, ButtonToolbar, Form } from 'react-bootstrap';
import { ReactLoading } from 'react-loading';
import Select from 'react-select';
import { connect } from 'react-redux';
import { setSelectedInstance, previousLoginStep } from '../../../actions';
import StateSelector from '../../../util/state-selectors';

class Step2 extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      localSelection: null
    };
  }

  onInstanceSelectionChange = (selectedInstance) => {
    this.setState({ localSelection: selectedInstance });
  }

  setInstanceSelection = () => {
    const { setInstance } = this.props;
    const { localSelection } = this.state;
    setInstance(localSelection);
  }

  renderLoadingSpinner = () => {
    const { isAuthenticating } = this.state;
    return isAuthenticating ? (
      <ReactLoading className="loadingSpinner" type="spin" height="10%" width="10%" />
    ) : null;
  }

  render() {
    const {
      currentStep,
      streamsInstances,
      previousStep,
      closePanel
    } = this.props;

    const {
      localSelection
    } = this.state;

    if (currentStep !== 2) {
      return null;
    }

    return (
      <div className="native-key-bindings">
        {this.renderLoadingSpinner()}
        <Form>
          <Form.Group controlId="formInstanceSelection">
            <Form.Label>Streams instance</Form.Label>
            <Select
              isSearchable
              options={streamsInstances.map(streamsInstance => ({ value: streamsInstance, label: streamsInstance.ServiceInstanceDisplayName }))}
              onChange={this.onInstanceSelectionChange}
              value={localSelection}
              placeholder="Select a Streams instance"
            />
          </Form.Group>

          <ButtonToolbar className="justify-content-between">
            <ButtonToolbar className="justify-content-start">
              <Button
                variant="primary"
                size="sm"
                type="submit"
                disabled={!localSelection}
                onClick={this.setInstanceSelection}
              >
                Next
              </Button>
              <Button
                variant="secondary"
                size="sm"
                type="submit"
                onClick={() => previousStep()}
              >
                Previous
              </Button>
            </ButtonToolbar>
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
  return {
    streamsInstances: StateSelector.getStreamsInstances(state) || [],
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setInstance: (selectedInstance) => dispatch(setSelectedInstance(selectedInstance.value)),
    previousStep: () => dispatch(previousLoginStep())
  };
};

Step2.propTypes = {
  currentStep: PropTypes.number.isRequired,
  streamsInstances: PropTypes.arrayOf(PropTypes.any).isRequired,
  setInstance: PropTypes.func.isRequired,
  previousStep: PropTypes.func.isRequired,
  closePanel: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Step2);
