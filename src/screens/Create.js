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
				<br />
				<br />
				<button
					onClick={async () => {
						const joinToken = prompt("Insert join token");
						const answer = { sdp: atob(joinToken), type: "answer" };
						await this.connection.setRemoteDescription(answer);
					}}
				>
					Set "JOIN TOKEN"
				</button>
			</div>
		);
	}

	async componentDidMount() {
		this.connection = new RTCPeerConnection({
			iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
		});
		const channel = this.connection.createDataChannel("data");
		const offer = await this.connection.createOffer();
		await this.connection.setLocalDescription(offer);

		this.connection.onicecandidate = (e) => {
			if (e.candidate === null) {
				// (search has finished)

				console.log("OFFER", this.connection.localDescription.sdp);

				const token = btoa(this.connection.localDescription.sdp);
				this.setState({ token });
			}
		};

		this.connection.oniceconnectionstatechange = (e) => {
			console.log("STATE", this.connection.iceConnectionState);
		};

		channel.onopen = () => {
			console.log("CONNECTED!");

			window.channel = channel;
			window.location.hash = "#/chat";
		};
	}

	get link() {
		const url = utils.getBaseUrl();
		return `${url}?token=${this.state.token}#/join`;
	}
}
