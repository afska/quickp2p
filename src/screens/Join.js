import React, { Component } from "react";
import utils from "../utils";

export default class Join extends Component {
	state = { token: null };

	render() {
		if (!this.inviteToken) return <div>Invalid token.</div>;

		return (
			<div>
				Send this token to your peer and wait...
				<br />
				<pre>{this.state.token}</pre>
			</div>
		);
	}

	async componentDidMount() {
		if (!this.inviteToken) return;

		const connection = new RTCPeerConnection({
			iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
		});

		const offer = { sdp: atob(this.inviteToken), type: "offer" };
		await connection.setRemoteDescription(offer);
		const answer = await connection.createAnswer();
		await connection.setLocalDescription(answer);

		connection.onicecandidate = (e) => {
			if (e.candidate === null) {
				// (search has finished)

				console.log("ANSWER", connection.localDescription.sdp);

				const token = btoa(connection.localDescription.sdp);
				this.setState({ token });
			}
		};

		connection.oniceconnectionstatechange = (e) => {
			console.log("STATE", connection.iceConnectionState);
			// TODO: Check for "connected"
		};

		connection.ondatachannel = ({ channel }) => {
			console.log("CHANNEL!");

			channel.onopen = () => {
				alert("CONNECTED!");

				window.channel = channel;
				window.location.hash = "#/chat";
			};
		};
	}

	get inviteToken() {
		return utils.getQueryString().token || null;
	}
}
