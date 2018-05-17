/**
 * Created by Captain on 2018/5/16 9:51.
 */

let util = {

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

export default util;
// module.exports = util;