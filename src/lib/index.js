import Channel from "./Channel";
import CorsAnywhereTinyUrlGoogleStore from "./stores/CorsAnywhereTinyUrlGoogleStore";
import serializer from "./serializer";
import uuid from "uuid/v1";

const CHANNEL_NAME = "data";
const ANSWER_SUFFIX = "-answer";

let store = CorsAnywhereTinyUrlGoogleStore;
let iceServers = [{ urls: "stun:stun.l.google.com:19302" }];

export default {
	async createChannel() {
		const channel = new Channel();
		channel.token = uuid();

		let connection, dataChannel;
		try {
			connection = new RTCPeerConnection({ iceServers });
			dataChannel = connection.createDataChannel(CHANNEL_NAME);
			const offer = await connection.createOffer();
			await connection.setLocalDescription(offer);
		} catch (e) {
			throw new Error("Error initializing channel: Cannot create offer");
		}

		try {
			const sessionDescription = await this._getSessionDescription(connection);
			await store.save(channel.token, sessionDescription);
		} catch (e) {
			throw new Error("Error initializing channel: Cannot write offer data");
		}

		this._setConnectHandler(connection, dataChannel, channel);
		this._setDisconnectHandler(connection, channel);

		channel.$waitAnswer = async () => {
			try {
				const sessionDescription = await store.get(
					channel.token + ANSWER_SUFFIX
				);
				const answer = serializer.deserialize(sessionDescription, "answer");
				await connection.setRemoteDescription(answer);
			} catch (e) {
				if (channel.$waitAnswer) channel.$waitAnswer();
			}
		};
		channel.$waitAnswer();

		return channel;
	},

	async joinChannel(token) {
		const channel = new Channel();
		channel.token = token;

		let offer;
		try {
			const sessionDescription = await store.get(token);
			offer = serializer.deserialize(sessionDescription, "offer");
		} catch (e) {
			throw new Error("Error joining channel: Cannot read offer data");
		}

		let connection;
		try {
			connection = new RTCPeerConnection({ iceServers });
			await connection.setRemoteDescription(offer);
			const answer = await connection.createAnswer();
			await connection.setLocalDescription(answer);
		} catch (e) {
			throw new Error("Error initializing channel: Cannot create answer");
		}

		try {
			const sessionDescription = await this._getSessionDescription(connection);
			await store.save(channel.token + ANSWER_SUFFIX, sessionDescription);
		} catch (e) {
			throw new Error("Error initializing channel: Cannot write answer data");
		}

		connection.ondatachannel = ({ channel: dataChannel }) => {
			this._setConnectHandler(connection, dataChannel, channel);
		};
		this._setDisconnectHandler(connection, channel);

		return channel;
	},

	setStore(newStore) { store = newStore; }, //                     prettier-ignore
	setIceServers(newIceServers) { iceServers = newIceServers; }, // prettier-ignore

	_getSessionDescription(connection) {
		return new Promise((resolve) => {
			connection.onicecandidate = (e) => {
				if (e.candidate !== null) return;
				resolve(serializer.serialize(connection.localDescription));
			};
		});
	},

	_setConnectHandler(connection, dataChannel, channel) {
		dataChannel.onopen = () => channel.connect(connection, dataChannel);
	},

	_setDisconnectHandler(connection, channel) {
		connection.oniceconnectionstatechange = (e) => {
			const isDisconnected = connection.iceConnectionState !== "connected";
			if (channel.isConnected && isDisconnected) channel.disconnect();
		};
	}
};
