import EventEmitter from "eventemitter3";

export default class BufferedEventEmitter extends EventEmitter {
	constructor() {
		super();

		this.pending = [];
	}

	emit(event, data) {
		const hasListeners = super.emit(event, data);
		if (!hasListeners) this.pending.push({ event, data });
		return hasListeners;
	}

	on(event, listener) {
		super.on(event, listener);

		const isPending = (it) => it.event === event;
		this.pending
			.filter(isPending)
			.forEach(({ event, data }) => listener(event, data));
		this.pending = this.pending.filter((it) => !isPending(it));

		return this;
	}
}
