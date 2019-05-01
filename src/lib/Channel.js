import EventEmitter from "eventemitter3";
import uuid from "uuid/v1";

export default class Channel extends EventEmitter {
	constructor(token = uuid()) {
		super();

		this.token = token;
		this.connection = null;
		this.dataChannel = null;
	}

	send(data) {
		this._checkConnected();

		this.dataChannel.send(data);
	}

	disconnect() {
		if (this.dataChannel) this.dataChannel.close();
		if (this.connection) this.connection.close();

		this.connection = null;
		this.dataChannel = null;
		this.$waitAnswer = null;
		this.emit("disconnected");
	}

	connect(connection, dataChannel) {
		this._checkNotConnected();

		this.connection = connection;
		this.dataChannel = dataChannel;
		this.dataChannel.onmessage = (e) => {
			const data = e.data;
			if (!data) return;

			this.emit("data", data);
		};
		this.emit("connected");
	}

	get isConnected() {
		return this.dataChannel !== null;
	}

	_checkConnected() {
		if (!this.isConnected) throw new Error("Error: Not connected");
	}

	_checkNotConnected() {
		if (this.isConnected) throw new Error("Error: Already connected");
	}
}
