import axios from "axios";

const PROXY = "https://api.allorigins.win/get?url=";
const SHORTENER = "https://tinyurl.com";
const ECHO = "http://scooterlabs.com/echo.json?data=";

export default {
	save(key, data) {
		const url = ECHO + encodeURIComponent(data);
		const encodedUrl = encodeURIComponent(url);
		const apiUrl = this._getCallUrl(
			`/create.php?url=${encodedUrl}&source=create&alias=${key}&submit=Make%20TinyURL!`
		);

		return axios.get(apiUrl).then(this._adaptResponse);
	},

	get(key) {
		return axios
			.get(this._getCallUrl(`/${key}`))
			.then(this._adaptResponse)
			.then((data) => JSON.parse(data).request.data)
			.then((url) => decodeURIComponent(url));
	},

	_adaptResponse(response) {
		const { data } = response;
		if (!data.status || data.status.http_code !== 200)
			throw new Error("Request failed");
		return data.contents;
	},

	_getCallUrl(route) {
		return PROXY + encodeURIComponent(SHORTENER + route);
	}
};
