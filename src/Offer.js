import React, { Component } from "react";

export default class Offer extends Component {
	state = {};

	render() {
		return (
			<div>
				Send this link to your peer:
				<br />
				<br />
				<a href={this.offerLink}>{this.offerLink}</a>
			</div>
		);
	}

	async componentDidMount() {
		const connection = new RTCPeerConnection();
		const offer = await connection.createOffer();
		this.setState({ token: btoa(offer.sdp) });
	}

	get offerLink() {
		const url = window.location.href.replace(window.location.hash, "");
		return `${url}?token=${this.state.token}#/invite`;
	}
}
