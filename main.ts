const fs = require('fs');
const io = require('socket.io-client');
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
    price: message[0].price,
    size: message[0].size,
    dateTime: new Date(message[0].exec_date).getTime()
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