/**
 * Created by Captain on 2018/7/11 16:03.
 */

let dialogType;
let running = false;

let context = {

  setDialogType: function (type) {
    dialogType = type;
  },

  getDialogType: function () {
    return dialogType;
  },

  setRunning: function (status) {
    running = status;
  },

  getRunning: function () {
    return running;
  }

};

export default context;