> ⚠️ This project is unmaintained. Please, use [peerjs](https://github.com/peers/peerjs).

# quickp2p

A simple WebRTC Data Channel library. It allows the communication between two nodes.

## Install

```bash
npm install --save quickp2p
```

## Configuration

- Deploy the `server` folder (a node.js server for temporary storage) somewhere.
- Configure the store:
```js
import quickp2p, { SimpleStore } from "quickp2p";

quickp2p.setStore(new SimpleStore(YOUR_STORE_URL));
```

## Usage

First, you have to create a channel:

```js
const channel = await quickp2p.createChannel();

channel
  .on("connected", () => { /* channel connected */ })
  .on("data", (message) => { /* message received */ })
  .on("timeout", () => { /* connection timeout */ })
  .on("disconnected", () => { /* channel disconnected */ });
```

Then, you can send `channel.token` to the other side, which should be running the following code:

```js
const channel = await quickp2p.joinChannel(token);

channel
  .on("connected", () => { /* channel connected */ })
  .on("data", (message) => { /* message received */ })
  .on("timeout", () => { /* connection timeout */ })
  .on("disconnected", () => { /* channel disconnected */ });
```

All channels have these methods:

| Method       | Parameter           | Description                                                   |
| ------------ |:-------------------:| --------------------------------------------------------------|
| `send`       | `String` or `Buffer`| Sends the data or throws an error if the connection was lost. |
| `disconnect` | -                   | Ends the connection.                                          |

If a channel emitted `"timeout"` or `"disconnected"`, it should be discarded.

## Demo

See https://afska.github.io/quickp2p for a live demo!

### Signalling server

You can use your own key-value store:

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

// `data` is always a base64-encoded String
```

### ICE Servers

By default, it uses the following ICE servers:

```js
[{ urls: "stun:stun.l.google.com:19302" }]
```

You can set another list of servers by using `quickp2p.setIceServers([ ... ])`.

### Timeout

You can change connection timeout (in milliseconds) by using `quickp2p.setTimeout(15 * 1000)`.

#### :warning: Symmetric NATs

This default server list won't work if both peers are under **Symmetric NATs**. To address that problem, you'll need to use a [TURN server](https://en.wikipedia.org/wiki/Traversal_Using_Relays_around_NAT).

A quick workaround could be enabling a [DMZ](https://en.wikipedia.org/wiki/DMZ_(computing)) on one side.

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

### Build

#### Demo

```bash
npm run build
```

#### Library

```bash
npm run build-lib
```

### Deploy

#### Demo

```bash
./deploy-demo.sh
```

#### Library

```bash
./deploy-lib.sh
```

