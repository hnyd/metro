/**
 * link数据模型
 *
 * Created by Captain on 2018/5/24 14:45.
 */

let linkData; // element data
let linkMap = {};
let fcLineMap = {}; // fc 列车 object映射map
let runTrainList = []; // 运行列车modal
let runTrainFcMap = {}; // 运行列车实体绘制对象映射map
let runTrainHeadFcMap = {}; // 运行列车车头实体绘制对象映射map
let runTrainIdFcMap = {}; // 运行列车名称绘制对象映射map

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
  },

  addRunTrain: function (train) {
    runTrainList.push(train);
    console.log('run link list: ', runTrainList);
  },

  getRunTrain: function () {
    return runTrainList;
  },

  containsId: function (id) {
    let result = false;
    runTrainList.forEach(function (element, index, array) {
      if (element['id'] === id) {
        result = true;
        return result;
      }
    });
    return result;
  },

  addRunTrainFc: function (id, trainFc) {
    runTrainFcMap[id] = trainFc;
  },

  addRunTrainHeadFc: function (id, headFc) {
    runTrainHeadFcMap[id] = headFc;
  },

  getRunFcMap: function () {
    return runTrainFcMap;
  },

  getRunHeadFcMap: function () {
    return runTrainHeadFcMap;
  },

  addRunTrainIdFc: function (id, idFc) {
    runTrainIdFcMap[id] = idFc;
  },

  getRunTrainIdFcMap: function () {
    return runTrainIdFcMap;
  }

};

export default link;
