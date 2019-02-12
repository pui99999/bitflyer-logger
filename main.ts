const fs = require('fs');

let db = [];
console.log("rpc-websockets on.");
const rpcws = require("rpc-websockets").Client;
const ws = new rpcws("wss://ws.lightstream.bitflyer.com/json-rpc");
const channelName = "lightning_executions_FX_BTC_JPY";

ws.on("open", () => {
  ws.call("subscribe", { channel: channelName });
});

ws.on("channelMessage", notify => {
  db.push({
    price: notify.message[0].price,
    size: notify.message[0].size,
    dateTime: new Date(notify.message[0].exec_date).getTime()
  });
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

setInterval(write, 24 * 60 * 60 * 1000);