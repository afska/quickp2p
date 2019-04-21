import React, { Component } from "react";
import utils from "../utils";

export default class Accept extends Component {
	state = { token: null };

	render() {
		if (!this.answerToken) return <div>Invalid token.</div>;

		return <div>Wait...</div>;
	}

	async componentDidMount() {
		if (!this.answerToken) return;

		const connection = new RTCPeerConnection(
			new RTCPeerConnection({
				iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
			})
		);
		const offer = await connection.createOffer();
		await connection.setLocalDescription(offer);
		const answer = { sdp: atob(this.answerToken), type: "answer" };
		await connection.setRemoteDescription(answer);

		connection.ondatachannel = ({ channel }) => {
			channel.onopen = () => {
				alert("CONNECTED!");

				window.channel = channel;
				window.location.hash = "#/chat";
			};
		};
	}

	get answerToken() {
		return utils.getQueryString().token || null;
	}
}
