import React, { Component } from "react";

export default class Chat extends Component {
	state = { messages: [] };

	render() {
		return (
			<div>
				<textarea value="piola" readOnly style={{ width: "50%" }} rows={10} />
				<br />
				<input type="text" />
			</div>
		);
	}
}
