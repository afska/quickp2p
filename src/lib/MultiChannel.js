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

		this._subscribeChannel(this.channel1, () => this.channel2);
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
		this._subscribeChannel(this.channel2, () => this.channel1);
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

	_subscribeChannel(channel, getOtherChannel) {
		if (channel.isConnected) this.handleConnection(channel);

		channel
			.on("connected", () => {
				this.handleConnection(channel);
			})
			.on("disconnected", () => {
				this.handleDisconnection(channel, getOtherChannel());
			})
			.on("data", this.handleData);
	}
}
