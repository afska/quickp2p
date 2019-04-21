import React, { Component } from "react";

export default class Chat extends Component {
	state = { messages: [] };

	render() {
		if (!window.channel) return <div>No connection.</div>;

		return (
			<div>
				<textarea value="test" readOnly style={{ width: "50%" }} rows={10} />
				<br />
				<input type="text" />
			</div>
		);
	}

	componentDidMount() {
		const channel = window.channel;

		channel.onmessage = function(e) {
			if (!e.data) return;

			console.log(e.data);
		};
	}
}
