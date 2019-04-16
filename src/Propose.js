import React, { Component } from "react";

export default class Propose extends Component {
	state = {};

	render() {
		return (
			<div>
				Send this link to your peer:
				<br />
				<br />
				<a href={this.inviteLink}>{this.inviteLink}</a>
			</div>
		);
	}

	async componentDidMount() {
		const connection = new RTCPeerConnection();
		const offer = await connection.createOffer();
		this.setState({ token: btoa(offer.sdp) });
	}

	get inviteLink() {
		const url = window.location.href.replace(window.location.hash, "");
		return `${url}/#/invite?token=${this.state.token}`;
	}
}
