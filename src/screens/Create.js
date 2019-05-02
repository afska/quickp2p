import React, { Component } from "react";
import utils from "../utils";
import quickp2p from "../lib";

export default class Create extends Component {
	state = { token: null };

	render() {
		if (!this.state.token) return <div>Wait...</div>;

		return (
			<div>
				Send this link to your peer and wait...
				<br />
				<br />
				<a href={this.link}>{this.link}</a>
			</div>
		);
	}

	async componentDidMount() {
		if (window.channel) window.channel.disconnect();

		window.channel = this.channel = await quickp2p.createChannel();
		this.setState({ token: this.channel.token });

		this.channel.on("connected", () => {
			window.location.hash = "#/chat";
		});
	}

	get link() {
		const url = utils.getBaseUrl();
		return `${url}?token=${this.state.token}#/join`;
	}
}
