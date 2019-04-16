import React, { Component } from "react";
import utils from "./utils";

export default class Invite extends Component {
	state = { token: null };

	render() {
		if (!this.offerToken) return <div>Invalid token.</div>;

		return (
			<div>
				Send this link to your peer and wait...
				<br />
				<br />
				<a href={this.link} target="_blank" rel="noopener noreferrer">
					{this.link}
				</a>
			</div>
		);
	}

	async componentDidMount() {
		if (!this.offerToken) return;

		const connection = new RTCPeerConnection();
		const offer = { sdp: atob(this.offerToken), type: "offer" };
		await connection.setRemoteDescription(offer);
		const answer = await connection.createAnswer();
		this.setState({ token: btoa([this.offerToken, answer.sdp]) });
	}

	get offerToken() {
		return utils.getQueryString().token || null;
	}

	get link() {
		const url = utils.getBaseUrl();
		return `${url}?token=${this.state.token}#/accept`;
	}
}
