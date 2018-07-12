/**
 * link数据模型
 *
 * Created by Captain on 2018/5/24 14:45.
 */


let linkData;
let linkMap = {};
let fcLineMap = {};

let link = {

  setLinkData: function (ll) {
    linkData = ll;
    for (let key in ll) {
      let entity = ll[key];
      linkMap[entity['id']] = entity;
    }
  },

  getLinkData: function () {
    return linkData;
  },

  getLinkMapData: function () {
    return linkMap;
  },

  setFcLineMap: function (map) {
    fcLineMap = map;
  },

  getFcLineMap: function () {
    return fcLineMap;
  }
};

export default link;