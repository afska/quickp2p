import EventEmitter from "eventemitter3";

export default class MultiChannel extends EventEmitter {
	constructor(channel1) {
		super();

		this.channel1 = channel1;
		this.channel2 = null;
		this.selectedChannel = null;

		this.handleConnection = this.handleConnection.bind(this);
		this.handleDisconnection = this.handleDisconnection.bind(this);
		this.handleData = this.handleData.bind(this);

		this._subscribeChannel1();
	}

	send(data) {
		this._checkConnected();

		this.selectedChannel.send(data);
	}

	disconnect() {
		this.channel1.disconnect();
		if (this.channel2) this.channel2.disconnect();
		this.selectedChannel = null;
		this.$waitChannel2 = null;
	}

	connect(channel2) {
		this.channel2 = channel2;
		this._subscribeChannel2();
	}

	handleConnection(channel) {
		if (this.isConnected) return;
		this.selectedChannel = channel;
		this.emit("connected");
	}

	handleDisconnection(channel, otherChannel) {
		if (otherChannel && otherChannel.isConnected)
			this.selectedChannel = otherChannel;
		else this.emit("disconnected");
	}

	handleData(data) {
		this.emit("data", data);
	}

	get token() {
		return this.channel1.token;
	}

	get isConnected() {
		return this.selectedChannel !== null;
	}

	_checkConnected() {
		if (!this.isConnected) throw new Error("Error: Not connected");
	}

	_subscribeChannel1() {
		this.channel1
			.on("connected", () => {
				this.handleConnection(this.channel1);
			})
			.on("disconnected", () => {
				this.handleDisconnection(this.channel1, this.channel2);
			})
			.on("data", this.handleData);
	}

	_subscribeChannel2() {
		this.channel2
			.on("connected", () => {
				this.handleConnection(this.channel2);
			})
			.on("disconnected", () => {
				this.handleDisconnection(this.channel2, this.channel1);
			})
			.on("data", this.handleData);
	}
}
