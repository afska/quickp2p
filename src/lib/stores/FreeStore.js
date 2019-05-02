import axios from "axios";

const PROXY = "https://api.allorigins.win/get?url=";
const URL = "https://tinyurl.com";

export default {
	save(key, data) {
		const url = this._url + encodeURIComponent(data);
		const encodedUrl = encodeURIComponent(url);
		const apiUrl = this._getCallUrl(
			`/create.php?url=${encodedUrl}&alias=${key}&submit=Make%20TinyURL!`
		);

		return axios.get(apiUrl).then(this._adaptResponse);
	},

	get(key) {
		return axios
			.get(this._getCallUrl(`/${key}`))
			.then(this._adaptResponse)
			.then((data) => {
				const html = document.createElement("html");
				html.innerHTML = data;
				return html.getElementsByTagName("title")[0].text.split(" - ")[0];
			})
			.then((url) => decodeURIComponent(url));
	},

	_url: `https://google.com/search?q=`,

	_adaptResponse(response) {
		const { data } = response;
		if (!data.status || data.status.http_code !== 200)
			throw new Error("Request failed");
		return data.contents;
	},

	_getCallUrl(route) {
		return PROXY + encodeURIComponent(URL + route);
	}
};
