import EventEmitter from "eventemitter3";

export default class Channel extends EventEmitter {
	constructor() {
		super();

		this.connection = null;
		this.dataChannel = null;
	}

	send(data) {
		if (!this.isConnected)
			throw new Error("Error sending message: Not connected");

		this.dataChannel.send(data);
	}

	waitFor(token) {}

	connect(connection, dataChannel) {
		this.connection = connection;
		this.dataChannel = dataChannel;
		this.dataChannel.onmessage = (e) => {
			const data = e.data;
			if (!data) return;

			this.emit("data", data);
		};
		this.emit("connected");
	}

	disconnect() {
		this.dataChannel.close();
		this.connection.close();

		this.connection = null;
		this.dataChannel = null;
		this.$waitAnswer = null;
		this.emit("disconnected");
	}

	get isConnected() {
		return this.dataChannel !== null;
	}
}
