import React, { Component } from "react";
import Propose from "./screens/Propose";
import Invite from "./screens/Invite";
import Accept from "./screens/Accept";
import Chat from "./screens/Chat";

export default class App extends Component {
	render() {
		const route = window.location.hash;

		if (route.startsWith("#/propose")) return <Propose />;
		if (route.startsWith("#/invite")) return <Invite />;
		if (route.startsWith("#/accept")) return <Accept />;
		if (route.startsWith("#/chat")) return <Chat />;

		return (
			<div>
				<h1>Valid urls:</h1>
				/#/propose
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
