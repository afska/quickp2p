import React, { Component } from "react";
import utils from "../utils";
import quickp2p from "../lib";

export default class Create extends Component {
	state = { token: null };

	render() {
		return (
			<div>
				Send this link to your peer:
				<br />
				<br />
				<a href={this.link}>{this.link}</a>
			</div>
		);
	}

	async componentDidMount() {
		this.channel = await quickp2p.createChannel();
		this.setState({ token: this.channel.token });

		this.channel.on("connected", () => {
			window.channel = this.channel;
			window.location.hash = "#/chat";
		});
	}

	get link() {
		const url = utils.getBaseUrl();
		return `${url}?token=${this.state.token}#/join`;
	}
}
