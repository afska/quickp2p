import React, { Component } from "react";

export default class Player2 extends Component {
	state = { isConnected: false };

	render() {
		return (
			<div>
				<button onClick={this.connect}>Connect</button>
				<button onClick={this.disconnect} disabled={!this.state.isConnected}>
					Disconnect
				</button>
			</div>
		);
	}
}
