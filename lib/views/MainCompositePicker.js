// @flow

"use strict";
"use babel";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { Button, ButtonToolbar, Modal } from "react-bootstrap";
import CreatableSelect from "react-select/lib/Creatable";

export default class MainCompositePicker extends React.Component<Props, State> {

	mainComposites = [];
	namespace = "";
	chosenMainComposite = "";

	constructor(props: Props){
		super(props);
		this.state = {mainComposites: []};
	}

	render(): React.Node {
		const style = {
			"borderBottomStyle": "solid",
			"borderBottomWidth": "1px",
			"borderLeftStyle": "solid",
			"borderLeftWidth": "1px",
			"borderRightStyle": "solid",
			"borderRightWidth": "1px",
			"fontWeight": "bold",
			"padding": "12px"
		};

		return(
			<Modal.Dialog
				show={this.state.show}
				style={style}>
				<Modal.Header>
					<Modal.Title componentClass="h1">Main Composite</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<CreatableSelect
						className="main-composite-select"
						isClearable
						onChange={this.handleChange.bind(this)}
						onInputChange={this.handleInputChange.bind(this)}
						options={this.state.mainComposites.map(a => ({label: a, value: a}))}
						placeholder="Select the main composite to build..."
					/>
				</Modal.Body>
				<Modal.Footer>
					<ButtonToolbar style={{"paddingTop": "5px"}}>
						<Button bsStyle="primary" onClick={this.props.handleBuild}>
								Build
						</Button>
						<Button bsStyle="default" onClick={this.props.handleCancel}>
								Cancel
						</Button>
					</ButtonToolbar>
				</Modal.Footer>

			</Modal.Dialog>
		);
	}

	handleChange = (newValue, actionMeta) => {
		this.setState({mainComposite: newValue});
		if (newValue) {
			this.props.handleUpdate(this.state.namespace, newValue.value);
		} else {
			this.props.handleUpdate("", "");
		}

	}

	handleInputChange = (inputValue, actionMeta) => {
	}

}
