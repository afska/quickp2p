import React, { Component } from "react";
import utils from "../utils";
import quickp2p from "../lib";

export default class Join extends Component {
	render() {
		if (!this.inviteToken) return <div>Invalid token.</div>;

		return <div>Wait...</div>;
	}

	async componentDidMount() {
		if (!this.inviteToken) return;
		if (window.channel) window.channel.disconnect();

		window.channel = this.channel = await quickp2p.joinChannel(
			this.inviteToken
		);

		this.channel.on("connected", () => {
			window.channel = this.channel;
			window.location.hash = "#/chat";
		});

		this.channel.on("timeout", () => {
			alert("TIMEOUT!");
			window.location.hash = "#/";
		});
	}

	get inviteToken() {
		return utils.getQueryString().token || null;
	}
}
