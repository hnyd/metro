/**
 * Created by Captain on 2018/7/12 15:08.
 */
import {getFc, fabric, isStationLine} from "../../util/stationUtil";
import context from '../../model/context';
import link from '../../model/link';

// 上行线路id列表
let upLineIds = [45, 46, 48, 49, 50, 51, 52, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 81, 97,
                 98, 99, 100, 101, 102, 217, 218, 219, 220, 221, 222, 223, 225, 227, 228, 229];
// 下行线路id列表
let downLineIds = [215, 214, 213, 211, 209, 208, 207, 206, 205, 204, 87, 86, 85, 84, 83, 82, 67, 66,
                   64, 63, 62, 61, 60, 59, 58, 57, 56, 55, 54, 25, 24, 235, 23, 22, 20, 19];
// 车站线路id列表
let stationLineIds = [24, 51, 55, 69, 58, 72, 62, 77, 84, 98, 204, 217, 207, 220];
let stationStopMap = {};

let lineIds = upLineIds;
let aniInterval; // 列车运动事件
let refreshInterval; // 页面刷新(重绘)事件
let fc;
// let trainEntity;
let linkMap;
let fcLineMap;

let trainIndex = 0;

let trainStatusMap = {
  0: '故障',
  1: '正常'
};

let animateInit = function () {
  $('#startRun').click(startRunTest);
  $('#stopRun').click(stopRunTest);
};

function startRunTest() {
  if (context.getRunning()) {
    return;
  }
  if (!linkMap) {
    linkMap = link.getLinkMapData();
  }
  if (!fcLineMap) {
    fcLineMap = link.getFcLineMap();
  }
  if (!fc) {
    fc = getFc();
  }
  let runFcMap = link.getRunFcMap();
  let trainEntity = runFcMap['train-test'];
  if (!trainEntity) {
    console.log('--> fcLineMap[lineIds[0]]:', fcLineMap[lineIds[0]]);
    trainEntity = new fabric.Rect(
        {
          left: fcLineMap[lineIds[0]].left - 40,
          top: fcLineMap[lineIds[0]].top - 22,
          fill: 'green',
          width: 40,
          height: 20
        }
    );
    let headEntity = new fabric.Triangle(
        {
          width: 20,
          height: 7,
          fill: 'green',
          left: trainEntity.left + 50,
          top: trainEntity.top,
          angle: 90
        });
    fc.add(trainEntity);
    fc.add(headEntity);
    let train = {
      id: 'train-test',
      type: 'real',
      status: 0,
      direction: 'up',
      trainIndex: 0
    };
    link.addRunTrain(train);
    link.addRunTrainFc('train-test', trainEntity);
    link.addRunTrainHeadFc('train-test', headEntity);
  }

  aniInterval = window.setInterval(trainAnimation, 1500);
  refreshInterval = window.setInterval(refresh, 50);
  context.setRunning(true);
}

function stopRunTest() {
  if (context.getRunning()) {
    window.clearInterval(aniInterval);
    window.clearInterval(refreshInterval);
    context.setRunning(false);
  }
}

function trainAnimation() {
  link.getRunTrain().forEach(function (trainData, index, array) {
    let trainIndex = trainData['trainIndex'];
    let direction = trainData['direction'];
    let lineIds = direction === 'up' ? upLineIds : downLineIds;
    let runFcMap = link.getRunFcMap();
    let runHeadFcMap = link.getRunHeadFcMap();
    let runIdFcMap = link.getRunTrainIdFcMap();
    let trainEntity;
    let headEntity;
    let idEntity;
    // 获取列车绘制实体
    if (runFcMap.hasOwnProperty(trainData['id'])) {
      trainEntity = runFcMap[trainData['id']];
    } else {
      trainEntity = new fabric.Rect(
          {
            left: fcLineMap[lineIds[trainIndex]].left - 40,
            top: fcLineMap[lineIds[trainIndex]].top - 22,
            fill: 'green',
            width: 40,
            height: 20
          }
      );
      // trainEntity.on('mousedown', function (options) {
      //   console.log('sdsdsds')
      //   let errorModel = {
      //     errorId: trainData['id'],
      //     errorFlag: 'Train',
      //     errorDialogType: '列车',
      //     errorDialogStatus: trainStatusMap[trainData['status']]
      //   };
      //   context.setErrorModel(errorModel);
      //   document.getElementById('menu').style.visibility = 'hidden';
      //   let menu = document.getElementById('trainMenu');
      //   if (options.button && options.button === 3) {
      //     let left = event.pageX + 15;
      //     let top = event.pageY + 15;
      //     menu.style.left = left + 'px';
      //     menu.style.top = top + 'px';
      //     menu.style.visibility = 'visible';
      //   } else if (options.button && options.button === 1) {
      //     menu.style.visibility = 'hidden';
      //   }
      // });

      fc.add(trainEntity);
      link.addRunTrainFc(trainData['id'], trainEntity);
    }
    // 获取车头绘制实体
    if (runHeadFcMap.hasOwnProperty(trainData['id'])) {
      headEntity = runHeadFcMap[trainData['id']];
    } else {
      let left = direction === 'up' ? trainEntity.left + 50 : trainEntity.left - 10;
      let top = direction === 'up' ? trainEntity.top : trainEntity.top + 20;
      let angle = direction === 'up' ? 90 : 270;
      headEntity = new fabric.Triangle(
          {
            width: 20,
            height: 7,
            fill: 'green',
            left: left,
            top: top,
            angle: angle
          });
      fc.add(headEntity);
      link.addRunTrainHeadFc(trainData['id'], headEntity);
    }
    // 获取列车名称绘制实体
    if (runIdFcMap.hasOwnProperty(trainData['id'])) {
      idEntity = runIdFcMap[trainData['id']];
    } else {
      idEntity = new fabric.Text(trainData['id'] + '',
                                 {
                                   left: trainEntity.left,
                                   top: trainEntity.top - 15,
                                   fontSize: 15,
                                   fill: '#ffffff',
                                   lockMovementX: true,
                                   lockMovementY: true,
                                   lockRotation: true,
                                   lockScalingX: true,
                                   lockScalingY: true
                                 });
      fc.add(idEntity);
      link.addRunTrainIdFc(trainData['id'], idEntity);
    }

    // --- animation controller begin ---

    if (trainIndex >= lineIds.length) {
      stopRunTest();
      return;
    }
    fcLineMap[lineIds[trainIndex]].set(
        {
          stroke: '#FF1B09'
        }
    );
    let boo;
    if (direction === 'up') {
      boo = trainEntity.left + 40 > fcLineMap[lineIds[trainIndex + 1]].left;
    } else {
      boo = trainEntity.left < fcLineMap[lineIds[trainIndex]].left;
    }
    if (boo) {
      trainIndex++;
      if (trainIndex > 0) {
        fcLineMap[lineIds[trainIndex - 1]].set(
            {
              stroke: '#0827ed'
            }
        )
      }
      fcLineMap[lineIds[trainIndex]].set(
          {
            stroke: '#FF1B09'
          }
      );
    }
    trainData['trainIndex'] = trainIndex;
    let lineId = lineIds[trainIndex];
    // 判断是否进入车站，进站停车6秒
    let isInStation;
    if (direction === 'up') {
      isInStation = trainEntity.left >= fcLineMap[lineId].left + fcLineMap[lineId].width / 2;
    } else {
      isInStation = trainEntity.left <= fcLineMap[lineId].left + fcLineMap[lineId].width / 2 + 20;
    }
    if (isInStation) {
      if (isStationLine(lineId)) {
        if (!stationStopMap.hasOwnProperty(lineId) || stationStopMap[lineId]['trainId']
            !== 'up-000') {
          stationStopMap[lineId] = {
            count: 1,
            trainId: 'up-000'
          };
          return;
        } else if (stationStopMap[lineId]['count'] < 6) {
          stationStopMap[lineId]['count']++;
          return;
        }
      }
    }
    let interval = direction === 'up' ? 20 : -20;

    // 移动所有的entity
    trainEntity.set(
        {
          left: trainEntity.left + interval,
          top: fcLineMap[lineIds[trainIndex]].top - 22
        }
    );
    let left = direction === 'up' ? trainEntity.left + 50 : trainEntity.left - 10;
    let top = direction === 'up' ? trainEntity.top : trainEntity.top + 20;
    headEntity.set(
        {
          left: left,
          top: top
        }
    );
    idEntity.set(
        {
          left: trainEntity.left,
          top: trainEntity.top - 17,
        }
    );
    // 为列车添加鼠标提示信息
    // trainEntity.on('mousemove', function () {
    //   console.log('train mouse move');
    //   let dire = direction === 'up' ? '上行' : '下行';
    //   let content = '列车id: ' + trainData['id'] + '\n' + '行驶方向:' + dire;
    //   let left = event.pageX + 15;
    //   let top = event.pageY + 15;
    //   if (document.getElementById('trainTip')) {
    //     let trainTip = document.getElementById('trainTip');
    //     trainTip.style.left = left + 'px';
    //     trainTip.style.top = top + 'px';
    //     trainTip.innerText = content;
    //   } else {
    //     let trainTip = document.createElement('div');
    //     trainTip.id = 'trainTip';
    //     trainTip.style.left = left + 'px';
    //     trainTip.style.top = top + 'px';
    //     trainTip.style.width = 100;
    //     trainTip.style.height = '95px';
    //     trainTip.style.position = 'absolute';
    //     trainTip.style.zIndex = 9999;
    //     trainTip.style.background = 'rgba(255, 255, 255, 0.8)';
    //     trainTip.innerText = content;
    //     trainTip.style.textAlign = 'center';
    //     document.body.appendChild(trainTip);
    //   }
    // });
    // trainEntity.on('mouseout', function () {
    //   console.log('train mouse out');
    //   if (document.getElementById('trainTip')) {
    //     document.body.removeChild(document.getElementById('trainTip'));
    //   }
    // });
  });
}

function refresh() {
  fc.renderAll();
}

let upLineOptions = {
  add: function (id) {
    downLineIds.push(id);
  }
};

let animateLineData = {
  getUpLineIds: function () {
    return upLineIds;
  },
  getDownLineIds: function () {
    return downLineIds;
  }
};

export {animateInit, upLineOptions, animateLineData};
