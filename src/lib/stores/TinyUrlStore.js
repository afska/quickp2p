import axios from "axios";

const URL = "https://tinyurl.com/";

export default {
	save(key, data) {
		const url = this._url + encodeURIComponent(data);
		const encodedUrl = encodeURIComponent(url);
		const apiUrl = `${URL}create.php?url=${encodedUrl}&alias=${key}&submit=Make%20TinyURL!`;

		return axios.get(apiUrl);
	},

	get(key) {
		return axios
			.get(`${URL}${key}`)
			.then((response) => response.request.res.responseUrl)
			.then((url) => decodeURIComponent(url.replace(this._url, "")));
	},

	_url: `${URL}?data=`
};
