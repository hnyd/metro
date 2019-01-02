/**
 * Created by Captain on 2018/5/16 9:51.
 */

// --- WebSocket ---
// let url = 'ws://127.0.0.1:8888/websocket';
let url = 'ws://10.206.199.254:3000/websocket';
let ws = new WebSocket(url);

ws.onopen = function (event) {
  console.log('===> [websocket] open');
  ws.onmessage = function (message) {
    console.log('===> [websocket] message: ', message);
    // TODO
  };

  ws.onerror = function (error) {
    console.log('===> [websocket] error: ', error);
    // TODO
  };

  ws.onclose = function () {
    console.log('===> [websocket] close');
    // TODO
  }
};

let network = {

  axios: null,

  setAxios: function (axios) {
    this.axios = axios;
  },

  getAxios: function () {
    return this.axios;
  },

  getOther: function () {
    // todo
  }

};

// websocket 测试发送
// let body = {
//   type: 'upload',
//   data: {},
//   desc: 'websocket body desc'
// };
// ws.send(JSON.stringify(body));

export {network, ws};
// module.exports = util;