import React, { Component } from "react";
import Player1 from "./Player1";
import Player2 from "./Player2";

export default class App extends Component {
	render() {
		switch (window.location.hash) {
			case "#/player1":
				return <Player1 />;
			case "#/player2":
				return <Player2 />;
			default:
				return <div>You need to use either /#/player1 or /#/player2</div>;
		}
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
