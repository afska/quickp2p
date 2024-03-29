import BufferedEventEmitter from "./helpers/BufferedEventEmitter";
import uuid from "uuid/v1";

export default class Channel extends BufferedEventEmitter {
	constructor(token = uuid()) {
		super();

		this.token = token;
		this.connection = null;
		this.dataChannel = null;
		this.$timeout = null;

		this.didDisconnect = false;
		this.didTimeout = false;
	}

	send(data) {
		this._checkConnected();

		this.dataChannel.send(data);
	}

	disconnect() {
		this.didDisconnect = true;

		const wasConnected = this.isConnected;
		if (this.dataChannel) this.dataChannel.close();
		if (this.connection) this.connection.close();

		this.connection = null;
		this.dataChannel = null;
		this.$waitAnswer = null;
		if (wasConnected) this.emit("disconnected");
		this._clearTimeout();
	}

	connect(connection, dataChannel) {
		this._checkNotConnected();

		this.connection = connection;
		this.dataChannel = dataChannel;

		const run = (data) => this.emit("data", data);
		if (dataChannel.buffer) {
			dataChannel.buffer.forEach(run);
			delete dataChannel.buffer;
		}

		this.dataChannel.onmessage = (e) => {
			const data = e.data;
			if (!data) return;

			this.emit("data", data);
		};
		this.emit("connected");
		this._clearTimeout();
	}

	setUpTimeout(timeout) {
		this.$timeout = setTimeout(() => {
			if (!this.isConnected) {
				this.didTimeout = true;

				this.disconnect();
				this.emit("timeout");
			}
		}, timeout);
	}

	get isConnected() {
		return this.dataChannel !== null;
	}

	_clearTimeout() {
		clearTimeout(this.$timeout);
		this.$timeout = null;
	}

	_checkConnected() {
		if (!this.isConnected) throw new Error("Error: Not connected");
	}

	_checkNotConnected() {
		if (this.isConnected) throw new Error("Error: Already connected");
	}
}
