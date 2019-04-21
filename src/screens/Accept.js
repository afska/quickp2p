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

		const connection = new RTCPeerConnection({
			iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
		});
		connection.createDataChannel("data");
		const offer = await connection.createOffer();
		await connection.setLocalDescription(offer);

		connection.onicecandidate = async (e) => {
			if (e.candidate === null) {
				// (search has finished)

				console.log("OFFER", connection.localDescription.sdp);

				const answer = { sdp: atob(this.answerToken), type: "answer" };
				await connection.setRemoteDescription(answer);

				console.log("ANSWER", answer.sdp);

				connection.ondatachannel = ({ channel }) => {
					console.log("CHANNEL!");

					channel.onopen = () => {
						alert("CONNECTED!");

						window.channel = channel;
						window.location.hash = "#/chat";
					};
				};

				connection.oniceconnectionstatechange = function(e) {
					console.log("STATE", connection.iceConnectionState);
				};
			}
		};
	}

	get answerToken() {
		return utils.getQueryString().token || null;
	}
}
