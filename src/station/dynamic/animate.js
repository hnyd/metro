/**
 * Created by Captain on 2018/7/12 15:08.
 */
import {getFc, fabric, isStationLine} from "../../util/stationUtil";
import context from '../../model/context';
import link from '../../model/link';

// 上行线路id列表
let upLineIds = [37, 39, 40, 41, 43, 45, 46, 48, 49, 50, 51, 52,
                 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 81, 97, 98, 99, 100, 101, 102, 103,
                 104, 105, 106, 108, 109, 111, 112, 113, 115, 116, 135, 136, 137, 138, 139, 140,
                 141, 142, 144, 145, 146, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 190,
                 191, 192, 194, 195, 217, 218, 219, 220, 221, 222, 223, 225, 227, 228, 229];
// 下行线路id列表
let downLineIds = [215, 214, 213, 211, 209, 208, 207, 206, 205, 204, 203, 178, 176, 175, 174, 173,
                   172, 171, 170, 236, 169, 134, 133, 131, 130, 129, 128, 127, 126, 125, 96, 94, 93,
                   92, 90, 89, 88, 87, 86, 85, 84, 83, 82, 67, 66, 64, 63, 62, 61, 60, 59, 58, 57,
                   56, 55, 54, 25, 24, 235, 23, 22, 20, 19, 16, 15, 14, 13, 11, 10, 8, 7, 6, 4, 3,
                   2];
// 车站线路id列表
let stationLineIds = [13, 39, 24, 51, 55, 69, 58, 72, 62, 77, 84, 98, 88, 103, 126, 136, 129, 139,
                      170, 180, 174, 185, 204, 217, 207, 220];
let stationStopMap = {};

let lineIds = upLineIds;
let aniInterval; // 列车运动事件
let refreshInterval; // 页面刷新(重绘)事件
let fc;
// let trainEntity;
let linkMap;
let fcLineMap;

let trainIndex = 0;

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
          fill: '#cc9900',
          width: 40,
          height: 20
        }
    );
    fc.add(trainEntity);
    let train = {
      id: 'train-test',
      type: 'real',
      direction: 'up',
      trainIndex: 0
    };
    link.addRunTrain(train);
    link.addRunTrainFc('train-test', trainEntity);
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
  console.log();
  link.getRunTrain().forEach(function (trainData, index, array) {
    let trainIndex = trainData['trainIndex'];
    let direction = trainData['direction'];
    let lineIds = direction === 'up' ? upLineIds : downLineIds;
    let runFcMap = link.getRunFcMap();
    let runIdFcMap = link.getRunTrainIdFcMap();
    let trainEntity;
    let idEntity;
    if (runFcMap.hasOwnProperty(trainData['id'])) {
      trainEntity = runFcMap[trainData['id']];
    } else {
      trainEntity = new fabric.Rect(
          {
            left: fcLineMap[lineIds[trainIndex]].left - 40,
            top: fcLineMap[lineIds[trainIndex]].top - 22,
            fill: '#cc9900',
            width: 40,
            height: 20
          }
      );
      fc.add(trainEntity);
      link.addRunTrainFc(trainData['id'], trainEntity);
    }
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
          top: fcLineMap[lineIds[trainIndex]].top - 22,
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