
const webclient = require("request");

const endpoint = {
    jp: "https://api.bitflyer.jp",
    us: "https://api.bitflyer.com"
}
const end = endpoint.us;
const url = {
    markets: end + "/v1/markets",
    board: end + "/v1/board?product_code=FX_BTC_JPY",
    ticker: end + "/v1/ticker?product_code=FX_BTC_JPY",
    executions: end + "/v1/getexecutions?product_code=FX_BTC_JPY",
    boardstate: end + "/v1/getboardstate?product_code=FX_BTC_JPY",
    health: end + "/v1/gethealth?product_code=FX_BTC_JPY",
    chats: end + "/v1/getchats",
    tickerAll: end + "/v1/ticker?all?v=1"
}

export class BitFlyerPublicAPI {
    markets() { return request("markets", url.markets); }
    board() { return request("board", url.board); }
    ticker() { return request("ticker", url.ticker); }
    executions(count: number) {
        return request("executions", url.executions + `&count=${count}`);
    }
    boardState() { return request("boardState", url.boardstate); }
    health() { return request("health", url.health); }
    tickerAll() { return request("tickerALll", url.tickerAll); }
}

function request(name: string, url: string) {
    return new Promise((resolve: any, reject: any) => {
        console.time(name);
        webclient.get({ url }, (err: any, response: any, payload: any) => {
            console.timeEnd(name);
            try {
                resolve(JSON.parse(payload));
            } catch {
                resolve(undefined);
            }
        });
    });
}