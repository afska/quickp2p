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
					style={{ width: "100%" }}
					rows={15}
					ref={(textarea) => (this.textarea = textarea)}
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
							this.setState({ input: "" });
							this._addMessage(`Me: ${this.state.input}`);
						}
					}}
					style={{ width: "100%" }}
				/>
			</div>
		);
	}

	componentDidMount() {
		const channel = window.channel;
		if (!channel) return;

		channel.on("data", (data) => {
			this._addMessage(`Stranger: ${data}`);
		});

		channel.on("disconnected", () => {
			alert("DISCONNECTED!");
			window.location.hash = "#/";
		});
	}

	componentWillUnmount() {
		window.channel = undefined;
	}

	_addMessage(content) {
		this.setState(
			{
				messages: [...this.state.messages, content]
			},
			() => {
				this.textarea.scrollTop = this.textarea.scrollHeight;
			}
		);
	}
}
