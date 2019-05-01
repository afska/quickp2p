import Channel from "./Channel";
import CorsAnywhereTinyUrlGoogleStore from "./stores/CorsAnywhereTinyUrlGoogleStore";
import WebRTC from "./WebRTC";
import uuid from "uuid/v1";

const config = {
	store: CorsAnywhereTinyUrlGoogleStore,
	iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
};
const webrtc = new WebRTC(config);

export default {
	async createChannel() {
		const channel = new Channel(uuid());

		const {
			connection,
			dataChannel
		} = await webrtc.createConnectionWithOffer();
		await webrtc.saveOffer(connection, channel);

		webrtc.setConnectHandler(connection, dataChannel, channel);
		webrtc.setDisconnectHandler(connection, channel);
		webrtc.setWaitHandler(connection, channel);

		return channel;
	},

	async joinChannel(token) {
		const channel = new Channel(token);

		const offer = await webrtc.getOffer(channel);
		const connection = await webrtc.createConnectionWithAnswer(offer);
		await webrtc.saveAnswer(connection, channel);

		connection.ondatachannel = ({ channel: dataChannel }) => {
			webrtc.setConnectHandler(connection, dataChannel, channel);
		};
		webrtc.setDisconnectHandler(connection, channel);

		return channel;
	},

	setStore(newStore) {
		config.store = newStore;
	},

	setIceServers(newIceServers) {
		config.iceServers = newIceServers;
	}
};
