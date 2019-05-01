# quickp2p

A dead simple WebRTC Data Channel library. It enables serverless communication between two nodes.

## Install

```bash
npm install --save quickp2p
```

## Usage

First you need to provide a simple key-value store.

I'll use [TinyURL](https://tinyurl.com/) for the example, but you can use any free service that lets you store data under a certain key.

```js
import quickp2p from "quickp2p";
import axios from "axios";

quickp2p.setStore({
  save(key, data) {
    const url = this._url + encodeURIComponent(data);

    return axios
      .get(`https://tinyurl.com/create.php?url=${encodeURIComponent(url)}&alias=${key}&submit=Make%20TinyURL!`)
      .then(() => key);
  },

  get(key) {
    return axios
      .get(`https://tinyurl.com/${key}`)
      .then((response) => response.request.res.responseUrl)
      .then((url) => decodeURIComponent(url.replace(this._url, "")));
  },

  _url: "https://rodri042.github.io/quickp2p/?data="
});
```

Then, you can create a channel:

```js
const channel = await quickp2p.createChannel();

channel
  .on("connected", () => { /* channel connected */ })
  .on("data", (message) => { /* message received */ })
  .on("disconnected", () => { /* channel disconnected */ })
```

Now send `channel.token` to the other side, which should be running a code like this one:

```js
const channel = await quickp2p.joinChannel(token);

channel
  .on("connected", () => { /* channel connected */ })
  .on("data", (message) => { /* message received */ })
  .on("disconnected", () => { /* channel disconnected */ })
```

All channels have this two methods:

- `channel.send(string | buffer)`
- `channel.disconnect()`

## Development

### Install

```bash
nvm use
npm install
```

### Run the app

```bash
npm start
```

### Run tests

```bash
npm test
```

### Build

```bash
npm run build
```
