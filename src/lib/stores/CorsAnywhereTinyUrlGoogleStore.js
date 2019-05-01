import axios from "axios";

const URL = "https://cors-anywhere.herokuapp.com/https://tinyurl.com/";

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
			.then((response) => {
				const { data } = response;
				const html = document.createElement("html");
				html.innerHTML = data;
				return html.getElementsByTagName("title")[0].text.split(" - ")[0];
			})
			.then((url) => decodeURIComponent(url));
	},

	_url: `https://google.com/search?q=`
};
