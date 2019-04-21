import React, { Component } from "react";
import Create from "./screens/Create";
import Join from "./screens/Join";
import Chat from "./screens/Chat";

export default class App extends Component {
	render() {
		const route = window.location.hash;

		if (route.startsWith("#/create")) return <Create />;
		if (route.startsWith("#/join")) return <Join />;
		if (route.startsWith("#/chat")) return <Chat />;

		return (
			<div>
				<h1>Valid urls:</h1>
				/#/create
				<br />
				/#/join?token=INVITE_TOKEN
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
