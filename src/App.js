import React, { Component } from "react";
import Offer from "./Offer";
import Invite from "./Invite";

export default class App extends Component {
	render() {
		const route = window.location.hash;

		if (route.startsWith("#/offer")) return <Offer />;
		if (route.startsWith("#/invite")) return <Invite />;

		return (
			<div>
				<h1>Valid urls:</h1>
				/#/offer
				<br />
				/#/invite?token=INVITE_TOKEN
				<br />
				/#/accept?token=ACCEPT_TOKEN
			</div>
		);
	}

	componentWillMount() {
		this._listener = window.addEventListener("hashchange", (e) => {
			this.forceUpdate();
		});
	}

	componentWillUnmount() {
		window.removeEventListener("hashchange", this._listener);
	}
}
