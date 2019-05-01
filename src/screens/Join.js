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

		this.channel = await quickp2p.joinChannel(this.inviteToken);

		this.channel.on("connected", () => {
			alert("CONNECTED!");

			window.channel = this.channel;
			window.location.hash = "#/chat";
		});
	}

	get inviteToken() {
		return utils.getQueryString().token || null;
	}
}
