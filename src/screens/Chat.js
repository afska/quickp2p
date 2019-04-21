import React, { Component } from "react";

export default class Chat extends Component {
	state = { messages: [], input: "" };

	render() {
		if (!window.channel) return <div>No connection.</div>;

		return (
			<div>
				<textarea
					value={this.state.messages.join("\n")}
					readOnly
					style={{ width: "50%" }}
					rows={10}
				/>
				<br />
				<input
					type="text"
					value={this.state.input}
					onChange={(e) => {
						this.setState({ input: e.target.value });
					}}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							window.channel.send(this.state.input);
							this.setState({
								input: "",
								messages: [...this.state.messages, `Me: ${this.state.input}`]
							});
						}
					}}
				/>
			</div>
		);
	}

	componentDidMount() {
		const channel = window.channel;
		if (!channel) return;

		channel.onmessage = (e) => {
			if (!e.data) return;

			this.setState({
				messages: [...this.state.messages, `Stranger: ${e.data}`]
			});
		};
	}

	componentWillUnmount() {
		window.channel = undefined;
	}
}
