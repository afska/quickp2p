# quickp2p

A dead simple WebRTC Data Channel library. It enables serverless communication between two nodes.

## Install

```bash
npm install --save quickp2p
```

## Usage

First, you have to create a channel:

```js
import quickp2p from "quickp2p";

const channel = await quickp2p.createChannel();

channel
  .on("connected", () => { /* channel connected */ })
  .on("data", (message) => { /* message received */ })
  .on("disconnected", () => { /* channel disconnected */ });
```

Then, you can send `channel.token` to the other side, which should be running the following code:

```js
const channel = await quickp2p.joinChannel(token);

channel
  .on("connected", () => { /* channel connected */ })
  .on("data", (message) => { /* message received */ })
  .on("disconnected", () => { /* channel disconnected */ });
```

All channels have these methods:

| Method       | Parameter           | Description                                                   |
| ------------ |:-------------------:| --------------------------------------------------------------|
| `send`       | `String` or `Buffer`| Sends the data or throws an error if the connection was lost. |
| `disconnect` | -                   | Ends the connection.                                          |

## Demo

See https://rodri042.github.io/quickp2p for a live demo!

## How does it works?

### Signalling

By default, it uses a combination of public free services to handle signalling. The session descriptions are saved using:
- [TinyURL](https://tinyurl.com/): To store temporary data.
- [CORS Anywhere](https://github.com/Rob--W/cors-anywhere): To access the TinyURL API.
- [Google](https://google.com): To access the stored data.

See the implementation [here](src/lib/stores/CorsAnywhereTinyUrlGoogleStore.js).

If you want something more reliable, you can use your own key-value store:

```js
quickp2p.setStore({
  save(key, data) {
    // save `data` under a certain `key`
    // return a promise
  },

  get(key) {
    // retrieve the data from `key`
    // return a promise of the data
  }
});
```

### ICE Servers

By default, it uses the following ICE servers:

```js
[{ urls: "stun:stun.l.google.com:19302" }]
```

You can set another list of servers using `quickp2p.setIceServers([ ... ])`.

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
