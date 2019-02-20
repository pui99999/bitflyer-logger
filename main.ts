import { BitFlyerPublicAPI } from './publicAPI';
const fs = require('fs');
const io = require('socket.io-client');
const bf = new BitFlyerPublicAPI();
let db = [];
console.log("rpc-websockets on.");
//Socket.IO
const channelName = "lightning_executions_FX_BTC_JPY";
const socket = io("https://io.lightstream.bitflyer.com", { transports: ["websocket"] });
socket.on("connect", () => {
  socket.emit("subscribe", channelName);
});
let ltp: number;
let date: string;
socket.on(channelName, message => {
  ltp = message[0].price;
  date = message[0].exec_date;
  const now = new Date().getTime();
  const wstime = new Date(date).getTime();
  console.log(`DELAY [${now - wstime}]`);
  if (ready && now - wstime < responseLimit) {
    ready = false;
    console.log("order.");
  }

});

const WebSocket = require("rpc-websockets").Client;

// note: rpc-websockets supports auto-reconection.
const ws = new WebSocket("wss://ws.lightstream.bitflyer.com/json-rpc");
// ws.on("open", () => {
//   ws.call("subscribe", {
//     channel: channelName
//   });
// });
ws.on("channelMessage", notify => {
  //console.log(notify.channel, notify.message);
  ltp = notify.message[0].price;
  date = notify.message[0].exec_date;
  const now = new Date().getTime();
  const wstime = new Date(date).getTime();
  console.log(`DELAY [${now - wstime}]`);
  if (ready && now - wstime < responseLimit) {
    ready = false;
    console.log("order.");
  }
});

const writeFile = (filename: string) => {
  console.log(`writeFile. length[${db.length}]`);
  fs.writeFile(`./data/${filename}.json`, JSON.stringify(db), "utf8", (error) => {
    if (error) { console.log(error); }
  });
}

let startTime: number = new Date().getTime();
const write = () => {
  const finishTime: number = new Date().getTime();
  writeFile(`${startTime}_${finishTime}`);
  db = [];
  startTime = finishTime;
}

const checkLtpResponse = () => {
  bf.ticker().then((ticker: any) => {
    const ticktime = new Date(ticker.timestamp).getTime() + 32400000;
    const wstime = new Date(date).getTime();
    console.log(`[${ticktime - wstime}]${(ticktime > wstime) ? "Tick" : "Websocket"}
Ticker    :[${ticker.ltp}][${ticktime}]
Websocket :[${ltp}][${wstime}]`);
  })
}

const checkLtpDelay = () => {
  const now = new Date().getTime();
  const wstime = new Date(date).getTime();
  console.log(`DELAY [${now - wstime}]`);
}

const responseLimit = 1500;
let ready: boolean = false;
const readyorder = () => {
  ready = true;
  console.log("ready.");
}

//setInterval(checkLtpResponse, 5500);
setInterval(readyorder, 6500);
setInterval(write, 24 * 60 * 60 * 1000);