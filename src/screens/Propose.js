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
		const offer = await connection.createOffer();

		console.log("OFFER", offer);
		connection.onicecandidate = function(e) {
			console.log("CANDIDATE", e.candidate);
		};

		this.setState({ token: btoa(offer.sdp) });
	}

	get link() {
		const url = utils.getBaseUrl();
		return `${url}?token=${this.state.token}#/invite`;
	}
}
