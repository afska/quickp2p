import React, { Component } from "react";
import quickp2p, { SimpleStore } from "./lib";
import Create from "./screens/Create";
import Join from "./screens/Join";
import Chat from "./screens/Chat";

quickp2p.setStore(new SimpleStore("https://misc.r-labs.io"));

export default class App extends Component {
	render() {
		const route = window.location.hash;

		if (route.startsWith("#/create")) return <Create />;
		if (route.startsWith("#/join")) return <Join />;
		if (route.startsWith("#/chat")) return <Chat />;

		return (
			<div>
				<h1>Valid urls:</h1>
				<a href="#/create">/#/create</a>
				<br />
				/#/join?token=INVITE_TOKEN
				<br />
				<br />>{" "}
				<a
					href="https://github.com/rodri042/quickp2p"
					target="_blank"
					rel="noopener noreferrer"
				>
					Source code and instructions
				</a>
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
