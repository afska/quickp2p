import querystring from "querystring";

export default {
	getBaseUrl() {
		return window.location.href
			.replace(window.location.hash, "")
			.replace(window.location.search, "");
	},
	getQueryString() {
		return querystring.parse(window.location.search.replace("?", ""));
	}
};
