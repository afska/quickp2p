import querystring from "querystring";

export default {
	getQueryString() {
		return querystring.parse(window.location.search.replace("?", ""));
	}
};
