import React, { Component } from "react";
import utils from "./utils";

export default class Offer extends Component {
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
		const connection = new RTCPeerConnection();
		const offer = await connection.createOffer();
		this.setState({ token: btoa(offer.sdp) });
	}

	get link() {
		const url = utils.getBaseUrl();
		return `${url}?token=${this.state.token}#/invite`;
	}
}
