import React, { Component } from "react";
import utils from "../utils";

export default class Propose extends Component {
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
		const connection = new RTCPeerConnection({
			iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
		});
		connection.createDataChannel("data");
		const offer = await connection.createOffer();
		await connection.setLocalDescription(offer);

		connection.onicecandidate = (e) => {
			if (e.candidate === null) {
				// (search has finished)

				console.log("OFFER", connection.localDescription.sdp);

				const token = btoa(connection.localDescription.sdp);
				this.setState({ token });
			}
		};
	}

	get link() {
		const url = utils.getBaseUrl();
		return `${url}?token=${this.state.token}#/invite`;
	}
}
