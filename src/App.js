import React, { Component } from "react";

export default class App extends Component {
	state = { isConnected: false };

	render() {
		switch (window.location.hash) {
			case "#/player1":
				return <div>player1</div>;
			case "#/player2":
				return <div>player2</div>;
			default:
				return <div>You need to use either /#/player1 or /#/player2</div>;
		}

		return (
			<div>
				<button onClick={this.connect}>Connect</button>
				<button onClick={this.disconnect} disabled={!this.state.isConnected}>
					Disconnect
				</button>
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
