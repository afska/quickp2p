import React, { Component } from "react";
import utils from "./utils";

export default class Invite extends Component {
	state = {};

	render() {
		if (!this.offerToken) return <div>Invalid token.</div>;

		return <div>Invite</div>;
	}

	get offerToken() {
		return utils.getQueryString().token || null;
	}
}
