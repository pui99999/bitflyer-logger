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

socket.on(channelName, message => {
  db.push({
    health: health,
    state: state,
    price: message[0].price,
    size: message[0].size,
    dateTime: new Date(message[0].exec_date).getTime()
  });
});

let health: number = 0;
let state: number = 0;

const boardstate = () => {
  const startTime = new Date().getTime();
  //取引所ステータス更新
  bf.boardState().then((boardState: any) => {
    const response = new Date().getTime() - startTime;
    if (response < 500) {
      health = (boardState.state === "RUNNING") ? 0 : -1;
      switch (boardState.health) {
        case "NORMAL":
          state = 0;
          break;
        case "BUSY":
          state = 1;
          break;
        case "VERY BUSY":
          state = 2;
          break;
        case "SUPER BUSY":
          state = 3;
          break;
        default:
          state = -1;
          break;
      }
    } else {
      state = -1;
    }
  })
}

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

setInterval(boardstate, 2000);
setInterval(write, 24 * 60 * 60 * 1000);