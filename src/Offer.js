import React, { Component } from "react";

export default class Offer extends Component {
	state = {};

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
		const connection = new RTCPeerConnection();
		const offer = await connection.createOffer();
		this.setState({ token: btoa(offer.sdp) });
	}

	get link() {
		const url = window.location.href.replace(window.location.hash, "");
		return `${url}?token=${this.state.token}#/invite`;
	}
}
