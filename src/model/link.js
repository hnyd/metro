/**
 * link数据模型
 *
 * Created by Captain on 2018/5/24 14:45.
 */


let linkData;

let link = {

  setLinkData: function (ll) {
    linkData = ll;
  },

  getLinkData: function () {
    return linkData;
  }
};

export default link;