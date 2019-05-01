import WebRTC from "./WebRTC";
import Channel from "./Channel";
import MultiChannel from "./MultiChannel";
import FreeStore from "./stores/FreeStore";

const CHANNEL2_SUFFIX = "-2";
const config = {
	store: FreeStore,
	iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
};
const webrtc = new WebRTC(config);

export default {
	async createMultiChannel() {
		const channel1 = await this.createChannel();
		const channel = new MultiChannel(channel1);

		channel.$waitChannel2 = async () => {
			try {
				const channel2 = await this.joinChannel(
					channel.token + CHANNEL2_SUFFIX
				);
				channel.connect(channel2);
			} catch (e) {
				if (channel.$waitChannel2) channel.$waitChannel2();
			}
		};
		channel.$waitChannel2();

		return channel;
	},

	async joinMultiChannel(token) {
		const channel1 = await this.joinChannel(token);
		const channel2 = await this.createChannel(token + CHANNEL2_SUFFIX);

		return new MultiChannel(channel1, channel2);
	},

	async createChannel(id) {
		const channel = new Channel(id);

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
