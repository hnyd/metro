/**
 * Created by Captain on 2018/7/11 16:03.
 */

let dialogType;

let context = {

  setDialogType: function (type) {
    dialogType = type;
  },

  getDialogType: function () {
    return dialogType;
  }

};

export default context;