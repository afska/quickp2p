const moment = require("moment");

const TTL = 300;

module.exports = class Element {
	constructor(key, value) {
		this.key = key;
		this.value = value;
		this.expiration = moment().add(TTL, "seconds");
	}

	get hasExpired() {
		return this.expiration.isBefore(moment());
	}
};
