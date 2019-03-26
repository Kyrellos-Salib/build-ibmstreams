'use babel';
'use strict';

import PropTypes from 'prop-types';
import * as React from 'react';
import { Button, Form } from 'react-bootstrap';
import Select from 'react-select';
import { connect } from 'react-redux';
import { setSelectedInstance } from '../../../actions';
import StateSelector from '../../../util/state-selectors';

class Step2 extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);

    this.onInstanceSelectionChange = this.onInstanceSelectionChange.bind(this);
    this.setInstanceSelection = this.setInstanceSelection.bind(this);
  }

  componentWillMount() {
    this.setState({ localSelection: null });
  }

  onInstanceSelectionChange(selectedInstance) {
    this.setState({ localSelection: selectedInstance });
  }

  setInstanceSelection() {
    const { setInstance } = this.props;
    const { localSelection } = this.state;
    console.log('setInstanceSelection', localSelection);
    setInstance(localSelection);
  }

  render() {
    const {
      currentStep,
      streamsInstances,
    } = this.props;

    const {
      localSelection
    } = this.state;

    if (currentStep !== 2) {
      return null;
    }

    return (
      <Form className="native-key-bindings">
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
        {/* <br /> */}
        <Button
          variant="primary"
          size="sm"
          type="submit"
          onClick={this.setInstanceSelection}
        >
          Submit
        </Button>
      </Form>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    streamsInstances: StateSelector.getStreamsInstances(state) || [],
    // selectedInstance: StateSelector.getSelectedInstanceName(state) || ''
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setInstance: (selectedInstance) => dispatch(setSelectedInstance(selectedInstance.value))
  };
};

Step2.propTypes = {
  currentStep: PropTypes.number.isRequired,
  streamsInstances: PropTypes.arrayOf(PropTypes.any).isRequired,
  setInstance: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Step2);
