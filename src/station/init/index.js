/**
 * 站场初始化模块
 * Created by Captain on 2018/3/14 16:09.
 */

// import {ws} from "../../network/utils";

import axios from 'axios' // 引入未配置的axios服务
import path from 'path'
import xmlParser from 'xml2js'
import {colorTrans, getFc, alert} from "stationUtil"
import link from '../../model/link.js'
import contModel from '../../model/context.js'
import {system} from "../../util/sysUtil";
import {upLineOptions, animateLineData} from "../dynamic/animate";

import {fabric} from 'fabric'

let cvs;
let fc;
let fcLineList = {};
let elementData,
    lineData,
    stationData = {}, // 车站
    switchData = {}, // 道岔
    psdData = {}, // 屏蔽门
    platformData = {},  // 站台
    fcLineIdTexts = [], // 线路id文本fc对象数组
    fcSwitchTexts = []; // 道岔文本fc对象数组
let context = {
  lineId: true,
  switchId: false
};
let mouseLineIndexId;
let mouseLineIndexKey;
let gridOptions;
let trainErrorGridOptions;
let signalErrorGridOptions;
let doorErrorGridOptions;
let stopErrorGridOptions;
let idList = [];
let showLineList = [19, 21, 20, 22, 23, 235, 24, 25, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 66,
                    67, 82, 83, 84, 85, 86, 87, 102, 101, 100, 99, 98, 97, 81, 79, 80, 65, 78, 77,
                    76, 75, 74, 73, 72, 71, 70, 69, 68, 52, 51, 50, 49, 48, 46, 45, 47, 204, 217,
                    205, 206, 218, 219, 207, 220, 208, 221, 222, 210, 226, 225, 211, 213,
                    227, 228, 214, 215, 216, 230, 209, 223, 229];
let rightLineList = [217, 204, 205, 206, 207, 208, 210, 226, 209, 211, 213, 214, 215, 216, 230, 228,
                     229, 227, 225, 223, 222, 221, 220, 219, 218];
let showStationList = [2, 3, 4, 5, 6, 12, 13];
let showPlatformList = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 23, 24, 25, 26]; // 屏蔽门psd/站台stage显示id列表
let isChange = true;
let offset = 1600;
let rightOffset = 6501.2;
let signalMap = contModel.getSignal();
let stopMap = contModel.getStop();
let turnoutMap = contModel.getTurnout();

let base = {
  'Line': {
    "eFlag": "Line",  // 元素标识
    "id": 88,         // 元素id
    "stationId": 7,   // 关联的车站的id
    "contentName": "",  // 显示内容
    "contentNameX": 0,  // 显示内容相对元素原点X坐标
    "contentNameY": 0,  // 显示内容相对元素原点Y坐标
    "stressShow": false,  // 突出显示
    "wordName": "ºÚÌå",  // 字体
    "wordSize": 15,      // 字段大小
    "wordColor": -1,     // 字体颜色 十进制 需转化为十六进制  -> #FFFFFF
    "displayStation": [5, 7], // 可显示车站列表，代表有哪些车站可以显示该轨道
    "controlStation": [7],    // 可控车站列表，代表有哪些车站可以控制该轨道
    "pointList": [
      {
        "x": 5023.015,
        "y": 742.540955,
        "index": 0
      },
      {
        "x": 5323.308,
        "y": 742.540955,
        "index": 1
      }
    ],            // 元素的绝对坐标
    "height": 8,  // 高度
    "horizontalAngle": 0,  // 水平(旋转)角度
    "selectedColor": 16777215, // 被选择时的颜色
    "backgroudColor": -1,  // 背景颜色  -1代表无
    "whetherShow": true,  // 是否显示
    "whetherUse": false,   // 是否可用
    "whetherPermission": false,  // 是否具有操作权限
    "faultColor": 16711936,  // 故障颜色
    "startPointType": 2, //  1-尽头线   2-计轴点   3-道岔
    "endPointType": 2, //   1-尽头线   2-计轴点   3-道岔
    "lineLength": 12900,
    "direction": 170
  },
  'Station': {
    "eFlag": "Station",
    "id": 2,
    "contentName": "±±Ô·Õ¾",
    "contentNameX": 0,  // 显示内容相对元素原点X坐标
    "contentNameY": 0,  // 显示内容相对元素原点Y坐标
    "x": 2160,  // 元素原点坐标X
    "y": 73.92357,  // 元素原点坐标Y
    "stressShow": false,  // 突出显示
    "wordName": "ºÚÌå",   // 字体
    "wordSize": 36,
    "wordColor": -1,
    "width": 10,
    "height": 20,
    "backgroudColor": -1,
    "whetherShow": true,
    "whetherUse": false,
    "whetherPermission": false,
    "horizontalAngle": 0,
    "faultColor": 16711936,
    "selectedColor": 16777215,
    "kiloContentX": 55,
    "kiloContentY": 48,
    "stationState": 0, // 车站状态 0正常 1故障
    "stationType": null,  // 车站类别
  },
  'Door': {
    "eFlag": "Door",
    "id": 1,
    "stationId": 1,
    "contentName": "",
    "contentNameX": 0,
    "contentNameY": 0,
    "x": 1166.308,
    "y": 230,
    "stressShow": false,
    "height": 4,
    "width": 120,
    "wordName": "ºÚÌå",
    "wordStyle": 1,
    "displayStation": [
      1,
    ],
    "controlStation": [
      1,
    ],
    "wordSize": 15,
    "wordColor": -1,
    "whetherShow": true,
    "whetherUse": false,
    "whetherPermission": false,
    "backgroudColor": -16711936,
    "horizontalAngle": 0,
    "defaultColor": 256,
    "selectedColor": 16777215,
    "faultColor": 16711936,
    "state": "Close",  // 屏蔽门状态 Close关闭 Open打开 Error故障
    "stopLocationId": 2,
    "autoOrManual": 0,  // 自动或手动
    "lineId": 13,
    "linkDirection": 55  // 线路运行方向
  },
  'Stage': {
    "eFlag": "Stage",
    "id": 7,
    "stationId": 4,
    "contentName": "ÐÐÕþÖÐÐÄÕ¾",
    "contentNameX": 0,
    "contentNameY": 0,
    "x": 0,
    "y": 0,
    "stressShow": false,
    "wordName": "ºÚÌå",
    "wordStyle": 1,
    "wordSize": 15,
    "wordColor": 16777215,
    "displayStation": [5, 4,],
    "controlStation": [4],
    "height": 30,
    "width": 200,
    "whetherShow": true,
    "whetherUse": false,
    "whetherPermission": false,
    "backgroudColor": -1,
    "horizontalAngle": 0,
    "faultColor": -8355712,
    "selectedColor": 16777215,
    "defaultTime": 30, // 默认停车时间（秒）
    "minTime": 30, // 站台最小停车时间（秒）
    "maxTime": 60, // 站台最大停车时间（秒）
    "stopColor": 256, // 列车停站颜色(是列车的颜色)
    "whetherStop": 0, // 列车是否稳定停靠
    "jumpState": 0, // 站台跳停状态，0不调停，1跳停
    "trainJumpStopList": [], // 跳停过的列车列表
    "jumpStopColor": 65281,  // 跳停颜色
    "lineId": 58,
    "emergencyCloseIdList": [7], // 站台急停按钮编号
    "openDoorStyle": 2, // 开门方式 1左开门 2有开门
    "runDirection": 1  // 列车运行方向 0上行 1下行
  }
};
let newElementList = {};
let fcSignalMap = {};
let fcStopMap = {};

let errorMap = contModel.getErrorMap();
let errorId = -1;
let errorFlag = '';
let errorDialogType = '';
let errorDialogStatus = '';

let strMap = {
  'Signal': signalMap,
  'Stop': stopMap
};
let signalStatusMap = {
  0: '故障',
  1: '弯股',
  2: '直行',
  4: '禁止通行'
};
let stopStatusMap = {
  0: '故障',
  1: '正常',
  2: '急停'
};

/**
 * 站场初始化
 * @param graphContext
 */
let initStation = function (graphContext) {

  // 鼠标点击事件初始化
  clickEventInit();

  let startTime = new Date().getTime();

  // 处理new数据
  // resolveNewData().then(function (value) {
  //   let nameMap = {
  //     'Line': 1,
  //     'Station': 1,
  //     'Door': 1,
  //     'Stage': 1,
  //   };
  //   // 逻辑和物理综合数据
  //   let elementList = value['_elementList'];
  //   let lineEntity = {};
  //   let stationEntity = {};
  //   let doorEntity = {};
  //   let stageEntity = {};
  //   for (let key in elementList) {
  //     if (elementList[key]['eFlag'] && nameMap.hasOwnProperty(elementList[key]['eFlag'])) {
  //       let flag = elementList[key]['eFlag'];
  //
  //       let entity = elementList[key];
  //       let tmp = {};
  //       for (let k in entity) {
  //         if (base[flag].hasOwnProperty(k)) {
  //           tmp[k] = entity[k];
  //         }
  //       }
  //       let isPlatformShown = false;
  //       showPlatformList.forEach(function (element, index, array) {
  //         if (entity['id'] === element) {
  //           isPlatformShown = true;
  //         }
  //       });
  //       switch (flag) {
  //         case 'Line':
  //           let isLineShown = false;
  //           showLineList.forEach(function (element, inedx, array) {
  //             if (entity['id'] === element) {
  //               isLineShown = true;
  //             }
  //           });
  //           if (isLineShown) {
  //             lineEntity[entity['id']] = tmp;
  //           }
  //           break;
  //         case 'Station':
  //           let isStationShown = false;
  //           showStationList.forEach(function (element, inedx, array) {
  //             if (entity['id'] === element) {
  //               isStationShown = true;
  //             }
  //           });
  //           if (isStationShown) {
  //             stationEntity[entity['id']] = tmp;
  //           }
  //           break;
  //         case 'Door':
  //           if (isPlatformShown) {
  //             doorEntity[entity['id']] = tmp;
  //           }
  //           break;
  //         case 'Stage':
  //           if (isPlatformShown) {
  //             stageEntity[entity['id']] = tmp;
  //           }
  //           break;
  //       }
  //     }
  //   }
  //   newElementList['Line'] = lineEntity;
  //   newElementList['Station'] = stationEntity;
  //   newElementList['Door'] = doorEntity;
  //   newElementList['Stage'] = stageEntity;
  //   console.log('newELementList:', newElementList);
  //   console.log('JSON:', JSON.stringify(newElementList));
  // });

  // 初始化站场
  fetchATSData().then(function (value) {
    lineData = value.lineData;
    elementData = value.elementData;

    console.log('--> fetch data in ', new Date().getTime() - startTime, 'ms');

    // 初始化物理数据
    formateData(graphContext);

    console.log('--> formate data in ', new Date().getTime() - startTime, 'ms');

    // 绘制站场
    // canvasPaintStation();

    // 加载完毕，隐藏loding
    document.getElementById('loading').style.visibility = 'hidden';

    paint();

  }, function (error) {
    console.log('--> error: ', error);
  });

};

/**
 * 鼠标点击事件初始化
 */
function clickEventInit() {
  // 阻止浏览器右键菜单！
  document.oncontextmenu = function (event) {
    event.preventDefault();
  };

  // 添加模拟列车菜单点击
  $('#mockTrainClick').click(function () {
    closeAllMenu();
    $('#mockTrainD').modal(
        {
          backdrop: 'static',
          keyboard: false
        });
  });

  $('#addSignalError').click(function () {
    closeAllMenu();
    $('#add-error-dialog').modal(
        {
          backdrop: 'static',
          keyboard: false
        });
  });

  $('#addStopError').click(function () {
    closeAllMenu();
    $('#add-error-dialog').modal(
        {
          backdrop: 'static',
          keyboard: false
        });
  });

  /**
   * 站场列车信息按钮
   */
  $('#trainDialog').click(function () {
    $('#trainInfoD').modal(
        {
          backdrop: 'static',
          keyboard: false
        }
    );
  });
  /**
   * 列车故障信息按钮
   */
  $('#error-train').click(function () {
    $('#error-train-dialog').modal(
        {
          backdrop: 'static',
          keyboard: false
        }
    );
  });
  /**
   * 信号机故障信息按钮
   */
  $('#error-signal').click(function () {
    $('#error-signal-dialog').modal(
        {
          backdrop: 'static',
          keyboard: false
        }
    );
  });
  /**
   * 急停按钮故障信息按钮
   */
  $('#error-stop').click(function () {
    $('#error-stop-dialog').modal(
        {
          backdrop: 'static',
          keyboard: false
        }
    );
  });
  /**
   * 屏蔽门故障信息按钮
   */
  $('#error-door').click(function () {
    $('#error-door-dialog').modal(
        {
          backdrop: 'static',
          keyboard: false
        }
    );
  });

  /**
   * 站场列车信息modal
   */
  $('#trainInfoD').on('shown.bs.modal', function () {
    let trainList = link.getRunTrain();
    if (!gridOptions) {
      gridOptions = {
        suppressMovableColumns: true,
      };
    }
    let columnDefs = [
      {headerName: "列车\\信息", field: "line", width: 150},
      {headerName: "运行方向", field: "direction", width: 150},
      {headerName: "列车类型", field: "type", width: 150},
      {headerName: "状态", field: "status", width: 300}
    ];
    let rowData = [];
    trainList.forEach(function (element, index, array) {
      let tmp = {};
      tmp['line'] = element['id'];
      tmp['direction'] = element['direction'] === 'up' ? '上行' : '下行';
      tmp['type'] = element['type'] === 'mock' ? '模拟' : '实体';
      tmp['status'] = '正常';
      rowData.push(tmp);
    });
    if (gridOptions.hasOwnProperty('rowData')) {
      gridOptions.api.setRowData([]);
      gridOptions.api.updateRowData({add: rowData});
      return;
    }
    gridOptions['columnDefs'] = columnDefs;
    gridOptions['rowData'] = rowData;
    let eGridDiv = document.querySelector('#trainInfo');
    new agGrid.Grid(eGridDiv, gridOptions);
  });

  /**
   * 列车故障modal
   */
  $('#error-train-dialog').on('shown.bs.modal', function () {
    let trainList = link.getRunTrain();
    if (!gridOptions) {
      gridOptions = {
        suppressMovableColumns: true,
      };
    }
    let columnDefs = [
      {headerName: "列车\\信息", field: "line", width: 150},
      {headerName: "运行方向", field: "direction", width: 150},
      {headerName: "列车类型", field: "type", width: 150},
      {headerName: "状态", field: "status", width: 300}
    ];
    let rowData = [];
    trainList.forEach(function (element, index, array) {
      let tmp = {};
      tmp['line'] = element['id'];
      tmp['direction'] = element['direction'] === 'up' ? '上行' : '下行';
      tmp['type'] = element['type'] === 'mock' ? '模拟' : '实体';
      tmp['status'] = '正常';
      rowData.push(tmp);
    });
    if (gridOptions.hasOwnProperty('rowData')) {
      gridOptions.api.setRowData([]);
      gridOptions.api.updateRowData({add: rowData});
      return;
    }
    gridOptions['columnDefs'] = columnDefs;
    gridOptions['rowData'] = rowData;
    let eGridDiv = document.querySelector('#error-train-info');
    new agGrid.Grid(eGridDiv, gridOptions);
  });

  /**
   * 信号机故障modal
   */
  $('#error-signal-dialog').on('shown.bs.modal', function () {
    let signalErrorMap = contModel.getErrorMap()['Signal'];
    if (!signalErrorGridOptions) {
      signalErrorGridOptions = {
        suppressMovableColumns: true,
      };
    }
    let columnDefs = [
      {headerName: "信号机\\信息", field: "id", width: 150},
      {headerName: "状态", field: "status", width: 150},
      {headerName: "故障备注", field: "remark", width: 450}
    ];
    let rowData = [];
    for (let k in signalErrorMap) {
      let tmp = {};
      tmp['id'] = k;
      tmp['status'] = signalStatusMap[signalMap[k]['status']]
      tmp['remark'] = signalErrorMap[k]['remark'];
      rowData.push(tmp);
    }
    if (signalErrorGridOptions.hasOwnProperty('rowData')) {
      signalErrorGridOptions.api.setRowData([]);
      signalErrorGridOptions.api.updateRowData({add: rowData});
      return;
    }
    signalErrorGridOptions['columnDefs'] = columnDefs;
    signalErrorGridOptions['rowData'] = rowData;
    let eGridDiv = document.querySelector('#error-signal-info');
    new agGrid.Grid(eGridDiv, signalErrorGridOptions);
  });

  /**
   * 急停按钮故障modal
   */
  $('#error-stop-dialog').on('shown.bs.modal', function () {
    let stopErrorMap = contModel.getErrorMap()['Stop'];
    if (!stopErrorGridOptions) {
      stopErrorGridOptions = {
        suppressMovableColumns: true,
      };
    }
    let columnDefs = [
      {headerName: "急停按钮\\信息", field: "id", width: 230},
      {headerName: "状态", field: "status", width: 150},
      {headerName: "故障备注", field: "remark", width: 370}
    ];
    let rowData = [];
    for (let k in stopErrorMap) {
      let tmp = {};
      tmp['id'] = k;
      tmp['status'] = stopStatusMap[stopMap[k]['status']];
      tmp['remark'] = stopErrorMap[k]['remark'];
      rowData.push(tmp);
    }
    if (stopErrorGridOptions.hasOwnProperty('rowData')) {
      stopErrorGridOptions.api.setRowData([]);
      stopErrorGridOptions.api.updateRowData({add: rowData});
      return;
    }
    stopErrorGridOptions['columnDefs'] = columnDefs;
    stopErrorGridOptions['rowData'] = rowData;
    let eGridDiv = document.querySelector('#error-stop-info');
    new agGrid.Grid(eGridDiv, stopErrorGridOptions);
  });

  /**
   * 屏蔽门故障modal
   */
  $('#error-door-dialog').on('shown.bs.modal', function () {
    let doorErrorMap = contModel.getErrorMap()['Door'];
    if (!doorErrorGridOptions) {
      doorErrorGridOptions = {
        suppressMovableColumns: true,
      };
    }
    let columnDefs = [
      {headerName: "屏蔽门\\信息", field: "id", width: 150},
      {headerName: "状态", field: "status", width: 150},
      {headerName: "故障备注", field: "remark", width: 450}
    ];
    let rowData = [];
    for (let k in doorErrorMap) {
      let tmp = {};
      tmp['id'] = k;
      // TODO doorMap
      // tmp['status'] = doorErrorMap[doorMap[k]['status']];
      tmp['remark'] = doorErrorMap[k]['remark'];
      rowData.push(tmp);
    }
    if (doorErrorGridOptions.hasOwnProperty('rowData')) {
      doorErrorGridOptions.api.setRowData([]);
      doorErrorGridOptions.api.updateRowData({add: rowData});
      return;
    }
    doorErrorGridOptions['columnDefs'] = columnDefs;
    doorErrorGridOptions['rowData'] = rowData;
    let eGridDiv = document.querySelector('#error-door-info');
    new agGrid.Grid(eGridDiv, doorErrorGridOptions);
  });

  $('#mockTrainD').on('shown.bs.modal', function () {
    let linkData = link.getLinkData();
    let direction = linkData[mouseLineIndexKey]['lineDirection'] === 55 ? '上行' : '下行';
    $('#mockDialogDirection').text(direction);

  });

  $('#add-error-dialog').on('shown.bs.modal', function () {
    $('#errorDialogType').text("元素:   " + errorDialogType);
    $('#errorDialogStatus').text("当前状态:   " + errorDialogStatus);
  });

  $('#addMockTrainBT').click(function () {
    let id = $('#mockLineName').val();
    if (link.containsId(id)) {
      alert('列车' + id + '已存在！');
      return;
    }
    let direction;
    let ids;
    if (link.getLinkData()[mouseLineIndexKey]['lineDirection'] === 55) {
      direction = 'up';
      ids = animateLineData.getUpLineIds();
    } else {
      direction = 'down';
      ids = animateLineData.getDownLineIds();
    }
    let trainIndex = -1;
    ids.forEach(function (element, index, array) {
      if (mouseLineIndexId === element) {
        trainIndex = index;
        return null;
      }
    });
    let train = {
      id: id,
      type: 'mock',
      direction: direction,
      trainIndex: trainIndex
    };
    link.addRunTrain(train);
    // alert('模拟列车添加成功');
    alert.primary('模拟列车添加成功')
    $('#mockTrainD').modal('hide');
    console.log('run link list: ', link.getRunTrain());
  });

  $('#addErrorBT').click(function () {
    let remark = $('#errorRemark').val();
    let mapData = errorMap[errorFlag];
    mapData[errorId] = {
      'remark': remark
    };
    errorMap[errorFlag] = mapData;
    contModel.setErrorMap(errorMap);
    alert.primary('注入故障成功');
    $('#add-error-dialog').modal('hide');
    console.log('error map:', errorMap);

    switch (errorFlag) {
      case 'Signal':
        signalMap[errorId]['status'] = 0;
        // fcSignalMap[errorId][0].set(
        //     {
        //       fill: 'gray'
        //     });
        // fcSignalMap[errorId][1].set(
        //     {
        //       fill: 'gray'
        //     });
        // fcSignalMap[errorId][2].set(
        //     {
        //       fill: 'gray'
        //     });
        paintSignal();
        break;
      case 'Stop':
        stopMap[errorId]['status'] = 0;
        paintStop();
        break;
      case 'Door':

    }

    fc.renderAll();
  });

}

function formateData(graphContext) {
  // 初始化线路
  formateLineData(graphContext);
  // 数据分类整理
  formateStationData();
}

function paint() {
  // 初始化fabric
  initFabric();

  // paintTmp();

  paintLine();
  paintStation();
  paintPsd();
  paintPlatform();
  paintSwitch();

  paintSignal();
  paintStop();

  paintTips();
}

/**
 * 初始化fabric绘图工具
 */
function initFabric() {
  fc = getFc();

  // fc.on('mouse:move', function (options) {
  //   console.log('--> options: ', options);
  //   if (options.target && options.target.stroke) {
  //     // options.target.stroke = '#FF1B09';
  //     options.target.set(
  //         {
  //           stroke: '#FF1B09'
  //         });
  //   }
  // });

  fc.fireRightClick = true; // 画布支持右键单击事件
  fc.selection = false; // 画布取消应用组选择

  // 监听鼠标坐标位置
  fc.on('mouse:move', function () {
    if (document.getElementById('menu').style.visibility === 'visible') {
      return; // 右键菜单显示时，不出现tip
    }
    let left = event.pageX + 15;
    let top = event.pageY + 15;
    let content = '坐标 x: ' + event.pageX + ' y:' + event.pageY;
    if (document.getElementById('coorTip')) {
      let coorTip = document.getElementById('coorTip');
      coorTip.style.left = left + 'px';
      coorTip.style.top = top + 'px';
      coorTip.innerText = content;
    } else {
      let coorTip = document.createElement('div');
      coorTip.id = 'coorTip';
      coorTip.style.left = left + 'px';
      coorTip.style.top = top + 'px';
      coorTip.style.width = 10 * content.length + 'px';
      coorTip.style.height = '25px';
      coorTip.style.textAlign = 'center';
      coorTip.style.position = 'absolute';
      coorTip.style.zIndex = 9998;
      coorTip.style.background = 'rgba(255, 255, 255, 0.8)';
      coorTip.innerText = content;
      document.body.appendChild(coorTip);
    }
  });

  // 监听鼠标右键
  fc.on('mouse:down', function (options) {
    let menu = document.getElementById('menu');
    if (options.button && options.button === 3) {
      closeAllMenu();
      removeCoorDiv(); // 先移除鼠标位置提示框
      let left = event.pageX + 15;
      let top = event.pageY + 15;
      menu.style.left = left + 'px';
      menu.style.top = top + 'px';
      menu.style.visibility = 'visible';
      // 线路名
      let lineIdClick = document.getElementById('lineIdClick');
      if (context.lineId) {
        lineIdClick.innerText = '隐藏线路名';
        lineIdClick.onclick = hideLineId;
      } else {
        lineIdClick.innerText = '显示线路名';
        lineIdClick.onclick = showLineId;
      }
      // 道岔名
      let switchIdClick = document.getElementById('switchIdClick');
      if (context.switchId) {
        switchIdClick.innerText = '隐藏道岔名称'
        switchIdClick.onclick = hideSwitchId;
      } else {
        switchIdClick.innerText = '显示道岔名称'
        switchIdClick.onclick = showSwitchId;
      }
    } else if (options.button && options.button === 1) {
      closeAllMenu();
      // menu.style.visibility = 'hidden';
    }
  });
}

function paintTmp() {
  let gray = new fabric.Circle(
      {
        radius: 20, fill: 'gray', left: 100, top: 100
      });
  let red = new fabric.Circle(
      {
        radius: 20, fill: 'red', left: 145, top: 100
      });
  let green = new fabric.Circle(
      {
        radius: 20, fill: 'green', left: 190, top: 100
      });
  let yellow = new fabric.Circle(
      {
        radius: 20, fill: 'yellow', left: 235, top: 100
      });

  let prompt = new fabric.Circle(
      {
        radius: 10, fill: 'red', left: 295, top: 100
      });
  fc.add(gray);
  fc.add(red);
  fc.add(green);
  fc.add(yellow);
  fc.add(prompt);

  let rect = new fabric.Rect(
      {
        left: 100,
        top: 20,
        fill: 'green',
        width: 50,
        height: 20
      });
  let head = new fabric.Triangle(
      {
        width: 20, height: 7, fill: 'green', left: 160, top: 20, angle: 90
      });
  fc.add(rect);
  fc.add(head);
}

/**
 * 绘制站场线路
 */
function paintLine() {
  let option = {
    strokeWidth: 8,
    stroke: '#0827ed',
    lockMovementX: true,
    lockMovementY: true,
    lockRotation: true,
    lockScalingX: true,
    lockScalingY: true
  };

  let linkData = link.getLinkData();
  for (let key in linkData) {
    if (!isShow(linkData[key]['id'], 'line') && isChange) {
      continue;
    }
    let off = isShow(linkData[key]['id'], 'right') && isChange ? rightOffset : offset;
    let pointList = linkData[key]['pointList'];
    let x1 = pointList[0]['X'] - off;
    let y1 = pointList[0]['Y'];
    let x2 = pointList[1]['X'] - off;
    let y2 = pointList[1]['Y'];
    let line = new fabric.Line([x1, y1, x2, y2], option);
    fcLineList[linkData[key]['id']] = line;

    line.on('mousemove', function () {
      fcLineList[linkData[key]['id']].set(
          {
            stroke: '#FF1B09'
          }
      );
      let content = '线路id: ' + linkData[key]['id'] + '\n(' + x1 + ', ' + y1 + ')\n' + '(' + x2
                    + ', ' + y2 + ')\n' + 'direction:' + linkData[key]['lineDirection'];
      let posi = '(' + x2 + ', ' + y2 + ')';
      removeCoorDiv(); // 先移除鼠标位置提示div
      let left = event.pageX + 15;
      let top = event.pageY + 15;
      if (document.getElementById('lineTip')) {
        let lineTip = document.getElementById('lineTip');
        lineTip.style.left = left + 'px';
        lineTip.style.top = top + 'px';
        lineTip.innerText = content;
      } else {
        let lineTip = document.createElement('div');
        lineTip.id = 'lineTip';
        lineTip.style.left = left + 'px';
        lineTip.style.top = top + 'px';
        lineTip.style.width = 10 * posi.length + 'px';
        lineTip.style.height = '95px';
        lineTip.style.position = 'absolute';
        lineTip.style.zIndex = 9999;
        lineTip.style.background = 'rgba(255, 255, 255, 0.8)';
        lineTip.innerText = content;
        lineTip.style.textAlign = 'center';
        document.body.appendChild(lineTip);
      }
      // fc.renderAll();
    });
    line.on('mouseout', function () {
      fcLineList[linkData[key]['id']].set(
          {
            stroke: '#0827ed'
          }
      );
      if (document.getElementById('lineTip')) {
        document.body.removeChild(document.getElementById('lineTip'));
      }
      // fc.renderAll();
    });
    line.on('mousedown', function (options) {
      // 记录鼠标点击事件发生时 所处的line id
      let id = linkData[key]['id'];
      // console.log('LineId: ', id);
      idList.push(id);
      console.log('idList:', idList);
      mouseLineIndexId = id;
      mouseLineIndexKey = key;

      document.getElementById('menu').style.visibility = 'hidden';
      let menu = document.getElementById('lineMenu');
      if (options.button && options.button === 3) {
        let left = event.pageX + 15;
        let top = event.pageY + 15;
        menu.style.left = left + 'px';
        menu.style.top = top + 'px';
        menu.style.visibility = 'visible';
      } else if (options.button && options.button === 1) {
        menu.style.visibility = 'hidden';
      }
    });

    fc.add(line);
    fc.add(new fabric.Line([x1 - 1, y1, x1, y1], {
      strokeWidth: 8,
      stroke: '#ffffff',
      lockMovementX: true,
      lockMovementY: true,
      lockRotation: true,
      lockScalingX: true,
      lockScalingY: true
    }));
    fc.add(new fabric.Line([x2, y2, x2 + 1, y2], {
      strokeWidth: 8,
      stroke: '#ffffff',
      lockMovementX: true,
      lockMovementY: true,
      lockRotation: true,
      lockScalingX: true,
      lockScalingY: true
    }));
    let fcLineIdText = new fabric.Text(linkData[key]['id'] + '',
                                       {
                                         left: x1,
                                         top: y1 + 6,
                                         fontSize: 15,
                                         fill: '#ffffff',
                                         lockMovementX: true,
                                         lockMovementY: true,
                                         lockRotation: true,
                                         lockScalingX: true,
                                         lockScalingY: true
                                       });
    fc.add(fcLineIdText);
    fcLineIdTexts.push(fcLineIdText);
  }
  link.setFcLineMap(fcLineList);
}

/**
 * 绘制车站
 */
function paintStation() {
  for (let key in stationData) {
    if (!isShow(stationData[key]['id'], 'station') && isChange) {
      continue;
    }
    let id = stationData[key]['id'];
    let off = (id === 12 || id === 13) && isChange ? rightOffset : offset;
    if (stationData[key]['Content']) {
      let content = stationData[key]['Content'];
      let x = stationData[key]['OriginX'] - off;
      let y = stationData[key]['OriginY'];
      let line = new fabric.Line([x, y, x + 10, y], {
        strokeWidth: 1,
        stroke: '#000000',
        lockMovementX: true,
        lockMovementY: true,
        lockRotation: true,
        lockScalingX: true,
        lockScalingY: true
      });
      fc.add(line);
      let text = fc.add(new fabric.Text(content, {
        left: line.left,
        top: line.top,
        fontSize: stationData[key]['FontSize'],
        fill: '#ffffff',
        lockMovementX: true,
        lockMovementY: true,
        lockRotation: true,
        lockScalingX: true,
        lockScalingY: true
      }));
    }
  }
}

/**
 * 绘制屏蔽门
 */
function paintPsd() {
  let option = {
    stroke: '#80ff00',
    lockMovementX: true,
    lockMovementY: true,
    lockRotation: true,
    lockScalingX: true,
    lockScalingY: true
  };
  for (let key in psdData) {
    if (!isShow(psdData[key]['id'], 'platform') && isChange) {
      continue;
    }
    let id = psdData[key]['id'];
    let off = (id === 23 || id === 24 || id === 25 || id === 26) && isChange ? rightOffset : offset;
    let entity = psdData[key];
    let x = entity['OriginX'] - 100 - off;
    let y = entity['OriginY'] - 50;
    option['strokeWidth'] = entity['Height'];
    let width = entity['width'];
    let line = new fabric.Line([x, y, x + width, y], option);
    fc.add(line);
  }
}

/**
 * 绘制站台
 */
function paintPlatform() {
  let option = {
    stroke: '#ffffff',
    lockMovementX: true,
    lockMovementY: true,
    lockRotation: true,
    lockScalingX: true,
    lockScalingY: true
  };
  for (let key in platformData) {
    if (!isShow(platformData[key]['id'], 'platform') && isChange) {
      continue;
    }
    let id = platformData[key]['id'];
    let off = (id === 23 || id === 24 || id === 25 || id === 26) && isChange ? rightOffset : offset;
    let entity = platformData[key];
    let lineId = entity['LinkId'];
    let x = entity['OriginX'] - 100 - off;
    let y = entity['OriginY'] - 63;
    let content = entity['Content'] + '-' + entity['id'];
    option['strokeWidth'] = entity['Height'];
    let width = entity['width'];
    let line = new fabric.Line([x, y, x + width, y], option);
    line.on('mousemove', function () {
      removeCoorDiv(); // 先移除鼠标位置提示div
      let left = event.pageX + 15;
      let top = event.pageY + 15;
      if (document.getElementById('platformTip')) {
        let platformTip = document.getElementById('platformTip');
        platformTip.style.left = left + 'px';
        platformTip.style.top = top + 'px';
        platformTip.innerText = content;
      } else {
        let platformTip = document.createElement('div');
        platformTip.id = 'platformTip';
        platformTip.style.left = left + 'px';
        platformTip.style.top = top + 'px';
        platformTip.style.width = 18 * content.length + 'px';
        platformTip.style.height = '25px';
        platformTip.style.position = 'absolute';
        platformTip.style.zIndex = 9999;
        platformTip.style.background = 'rgba(255, 255, 255, 0.8)';
        platformTip.innerText = content;
        platformTip.style.textAlign = 'center';
        document.body.appendChild(platformTip);
      }
      fcLineList[lineId].set(
          {
            stroke: '#e0d817'
          }
      );
      fc.renderAll();
    });
    line.on('mouseout', function () {
      if (document.getElementById('platformTip')) {
        document.body.removeChild(document.getElementById('platformTip'));
      }
      fcLineList[lineId].set(
          {
            stroke: '#0827ed'
          }
      );
      fc.renderAll();
    });
    fc.add(line);
  }
}

/**
 * 绘制信号机
 */
function paintSignal() {
  for (let key in signalMap) {
    let signal = signalMap[key];
    let id = signal['id'];
    let x = signal['x'];
    let y = signal['y'];
    let status = signal['status'];
    paintCircle(id, x, y, status);
  }
  contModel.setFcSignalMap(fcSignalMap);
}

function paintCircle(id, x, y, status) {
  let one = new fabric.Circle(
      {
        radius: 10, fill: 'gray', left: x, top: y
      }
  );
  let two = new fabric.Circle(
      {
        radius: 10, fill: 'gray', left: x + 23, top: y
      }
  );
  let three = new fabric.Circle(
      {
        radius: 10, fill: 'gray', left: x + 46, top: y
      }
  );
  let option = {
    transparentCorners: true,
    strokeWidth: 22,
    lockMovementX: true,
    lockMovementY: true,
    lockRotation: true,
    lockScalingX: true,
    lockScalingY: true
  };

  let statusMsg = '状态: 故障';
  switch (status) {
    case 4:
      statusMsg = '状态: 禁止通行';
      one.set(
          {
            fill: 'red'
          }
      );
      break;
    case 2:
      statusMsg = '状态: 直行';
      two.set(
          {
            fill: 'green'
          }
      );
      break;
    case 1:
      statusMsg = '状态: 弯股';
      three.set(
          {
            fill: 'yellow'
          }
      );
      break;
  }

  // 为三个信号机添加覆盖面板
  let cover = new fabric.Line([x, y, x + 68, y], option);
  // 为信号机覆盖面板添加鼠标悬停提示框，并高亮显示道岔
  cover.on('mousemove', function () {
    removeCoorDiv(); // 先移除鼠标位置提示div
    let left = event.pageX + 15;
    let top = event.pageY + 15;
    let turnoutId = signalMap[id]['turnoutId'];
    let turnout = turnoutMap[turnoutId];
    let lineMap = turnout['lineMap'];
    let content = '信号机: ' + id + '\n' + statusMsg + '\n' + '道岔: ' + lineMap;
    if (document.getElementById('signalTip')) {
      let signalTip = document.getElementById('signalTip');
      signalTip.style.left = left + 'px';
      signalTip.style.top = top + 'px';
      signalTip.innerText = content;
    } else {
      let signalTip = document.createElement('div');
      signalTip.id = 'signalTip';
      signalTip.style.left = left + 'px';
      signalTip.style.top = top + 'px';
      signalTip.style.width = '200px';
      signalTip.style.height = '75px';
      signalTip.style.position = 'absolute';
      signalTip.style.zIndex = 9999;
      signalTip.style.background = 'rgba(255, 255, 255, 0.8)';
      signalTip.innerText = content;
      signalTip.style.textAlign = 'center';
      document.body.appendChild(signalTip);
    }
    lineMap.forEach(function (element, index, array) {
      fcLineList[element].set(
          {
            stroke: '#e0d817'
          }
      );
    });
    fc.renderAll();
  });
  cover.on('mouseout', function () {
    let turnoutId = signalMap[id]['turnoutId'];
    let turnout = turnoutMap[turnoutId];
    let lineMap = turnout['lineMap'];
    if (document.getElementById('signalTip')) {
      document.body.removeChild(document.getElementById('signalTip'));
    }
    lineMap.forEach(function (element, index, array) {
      fcLineList[element].set(
          {
            stroke: '#0827ed'
          }
      );
    });
    fc.renderAll();
  });
  cover.on('mousedown', function (options) {
    errorId = id;
    errorFlag = 'Signal';
    errorDialogType = '信号机';
    errorDialogStatus = statusMsg.substr(4);

    document.getElementById('menu').style.visibility = 'hidden';
    let menu = document.getElementById('signalMenu');
    if (options.button && options.button === 3) {
      let left = event.pageX + 15;
      let top = event.pageY + 15;
      menu.style.left = left + 'px';
      menu.style.top = top + 'px';
      menu.style.visibility = 'visible';
    } else if (options.button && options.button === 1) {
      menu.style.visibility = 'hidden';
    }
  });
  fc.add(one);
  fc.add(two);
  fc.add(three);
  fc.add(cover); // 为三个信号机添加覆盖面板
  let list = [];
  list.push(one);
  list.push(two);
  list.push(three);
  fcSignalMap[id] = list;
}

function paintStop() {
  for (let key in stopMap) {
    let stop = stopMap[key];
    let id = stop['id'];
    let x = stop['x'] - 9;
    let y = stop['y'] - 66;
    let status = stop['status'];
    let color = "";
    let statusMsg = '状态: ';
    switch (status) {
      case 0:
        statusMsg += '故障';
        color = "gray";
        break;
      case 1:
        statusMsg += '正常';
        color = "#80ff00";
        break;
      case 2:
        statusMsg += '急停';
        color = "red";
        break;
    }
    let circle = new fabric.Circle(
        {
          radius: stop['radius'],
          fill: color,
          left: x,
          top: y,
          lockMovementX: true,
          lockMovementY: true,
          lockRotation: true,
          lockScalingX: true,
          lockScalingY: true
        }
    );
    let stageId = stop['stageId'];
    let stage = platformData['ElementKeyClass [_elementType=Platform, Id=' + stageId + ']'];
    let lineId = stage['LinkId'];
    let content = '急停按钮: ' + id + '\n' + statusMsg;
    circle.on('mousemove', function () {
      removeCoorDiv(); // 先移除鼠标位置提示div
      let left = event.pageX + 15;
      let top = event.pageY + 15;
      if (document.getElementById('stopTip')) {
        let stopTip = document.getElementById('stopTip');
        stopTip.style.left = left + 'px';
        stopTip.style.top = top + 'px';
        stopTip.innerText = content;
      } else {
        let stopTip = document.createElement('div');
        stopTip.id = 'stopTip';
        stopTip.style.left = left + 'px';
        stopTip.style.top = top + 'px';
        stopTip.style.width = '150px';
        stopTip.style.height = '50px';
        stopTip.style.position = 'absolute';
        stopTip.style.zIndex = 9999;
        stopTip.style.background = 'rgba(255, 255, 255, 0.8)';
        stopTip.innerText = content;
        stopTip.style.textAlign = 'center';
        document.body.appendChild(stopTip);
      }
      fcLineList[lineId].set(
          {
            stroke: '#e0d817'
          }
      );
      fc.renderAll();
    });
    circle.on('mouseout', function () {
      if (document.getElementById('stopTip')) {
        document.body.removeChild(document.getElementById('stopTip'));
      }
      fcLineList[lineId].set(
          {
            stroke: '#0827ed'
          }
      );
      fc.renderAll();
    });
    circle.on('mousedown', function (options) {
      errorId = id;
      errorFlag = 'Stop';
      errorDialogType = '急停按钮';
      errorDialogStatus = statusMsg.substr(4);

      document.getElementById('menu').style.visibility = 'hidden';
      let menu = document.getElementById('stopMenu');
      if (options.button && options.button === 3) {
        let left = event.pageX + 15;
        let top = event.pageY + 15;
        menu.style.left = left + 'px';
        menu.style.top = top + 'px';
        menu.style.visibility = 'visible';
      } else if (options.button && options.button === 1) {
        menu.style.visibility = 'hidden';
      }
    });
    fc.add(circle);
    fcStopMap[id] = circle;
  }
  contModel.setFcStopMap(fcStopMap);
  // console.log("fcStopMap:", contModel.getFcStopMap());
}

function paintTips() {
  let tipFcList = [];

  // Signal
  tipFcList.push(new fabric.Text('信号机 : ', {
    left: 188,
    top: 520,
    fontSize: 20,
    fill: '#9A9A9A',
    lockMovementX: true,
    lockMovementY: true,
    lockRotation: true,
    lockScalingX: true,
    lockScalingY: true
  }));
  tipFcList.push(new fabric.Circle(
      {
        lockMovementX: true,
        lockMovementY: true,
        lockRotation: true,
        lockScalingX: true,
        lockScalingY: true,
        radius: 10, fill: 'gray', left: 188, top: 555
      }
  ));
  tipFcList.push(new fabric.Circle(
      {
        lockMovementX: true,
        lockMovementY: true,
        lockRotation: true,
        lockScalingX: true,
        lockScalingY: true,
        radius: 10, fill: 'gray', left: 188 + 23, top: 555
      }
  ));
  tipFcList.push(new fabric.Circle(
      {
        lockMovementX: true,
        lockMovementY: true,
        lockRotation: true,
        lockScalingX: true,
        lockScalingY: true,
        radius: 10, fill: 'gray', left: 188 + 46, top: 555
      }
  ));
  tipFcList.push(new fabric.Text('故障', {
    left: 267,
    top: 556,
    fontSize: 17,
    fill: '#9A9A9A',
    lockMovementX: true,
    lockMovementY: true,
    lockRotation: true,
    lockScalingX: true,
    lockScalingY: true
  }));
  tipFcList.push(new fabric.Circle(
      {
        lockMovementX: true,
        lockMovementY: true,
        lockRotation: true,
        lockScalingX: true,
        lockScalingY: true,
        radius: 10, fill: 'red', left: 188, top: 585
      }
  ));
  tipFcList.push(new fabric.Circle(
      {
        lockMovementX: true,
        lockMovementY: true,
        lockRotation: true,
        lockScalingX: true,
        lockScalingY: true,
        radius: 10, fill: 'gray', left: 188 + 23, top: 585
      }
  ));
  tipFcList.push(new fabric.Circle(
      {
        lockMovementX: true,
        lockMovementY: true,
        lockRotation: true,
        lockScalingX: true,
        lockScalingY: true,
        radius: 10, fill: 'gray', left: 188 + 46, top: 585
      }
  ));
  tipFcList.push(new fabric.Text('禁止通行', {
    left: 267,
    top: 586,
    fontSize: 17,
    fill: 'red',
    lockMovementX: true,
    lockMovementY: true,
    lockRotation: true,
    lockScalingX: true,
    lockScalingY: true
  }));
  tipFcList.push(new fabric.Circle(
      {
        lockMovementX: true,
        lockMovementY: true,
        lockRotation: true,
        lockScalingX: true,
        lockScalingY: true,
        radius: 10, fill: 'gray', left: 188, top: 615
      }
  ));
  tipFcList.push(new fabric.Circle(
      {
        lockMovementX: true,
        lockMovementY: true,
        lockRotation: true,
        lockScalingX: true,
        lockScalingY: true,
        radius: 10, fill: 'green', left: 188 + 23, top: 615
      }
  ));
  tipFcList.push(new fabric.Circle(
      {
        lockMovementX: true,
        lockMovementY: true,
        lockRotation: true,
        lockScalingX: true,
        lockScalingY: true,
        radius: 10, fill: 'gray', left: 188 + 46, top: 615
      }
  ));
  tipFcList.push(new fabric.Text('直行', {
    left: 267,
    top: 616,
    fontSize: 17,
    fill: 'green',
    lockMovementX: true,
    lockMovementY: true,
    lockRotation: true,
    lockScalingX: true,
    lockScalingY: true
  }));
  tipFcList.push(new fabric.Circle(
      {
        lockMovementX: true,
        lockMovementY: true,
        lockRotation: true,
        lockScalingX: true,
        lockScalingY: true,
        radius: 10, fill: 'gray', left: 188, top: 645
      }
  ));
  tipFcList.push(new fabric.Circle(
      {
        lockMovementX: true,
        lockMovementY: true,
        lockRotation: true,
        lockScalingX: true,
        lockScalingY: true,
        radius: 10, fill: 'gray', left: 188 + 23, top: 645
      }
  ));
  tipFcList.push(new fabric.Circle(
      {
        lockMovementX: true,
        lockMovementY: true,
        lockRotation: true,
        lockScalingX: true,
        lockScalingY: true,
        radius: 10, fill: 'yellow', left: 188 + 46, top: 645
      }
  ));
  tipFcList.push(new fabric.Text('弯股', {
    left: 267,
    top: 646,
    fontSize: 17,
    fill: 'yellow',
    lockMovementX: true,
    lockMovementY: true,
    lockRotation: true,
    lockScalingX: true,
    lockScalingY: true
  }));

  // Stop
  tipFcList.push(new fabric.Text('急停按钮 : ', {
    left: 440,
    top: 520,
    fontSize: 20,
    fill: '#9A9A9A',
    lockMovementX: true,
    lockMovementY: true,
    lockRotation: true,
    lockScalingX: true,
    lockScalingY: true
  }));
  tipFcList.push(new fabric.Circle(
      {
        lockMovementX: true,
        lockMovementY: true,
        lockRotation: true,
        lockScalingX: true,
        lockScalingY: true,
        radius: 10, fill: 'gray', left: 440, top: 555
      }
  ));
  tipFcList.push(new fabric.Text('故障', {
    left: 473,
    top: 556,
    fontSize: 17,
    fill: '#9A9A9A',
    lockMovementX: true,
    lockMovementY: true,
    lockRotation: true,
    lockScalingX: true,
    lockScalingY: true
  }));
  tipFcList.push(new fabric.Circle(
      {
        lockMovementX: true,
        lockMovementY: true,
        lockRotation: true,
        lockScalingX: true,
        lockScalingY: true,
        radius: 10, fill: 'red', left: 440, top: 585
      }
  ));
  tipFcList.push(new fabric.Text('急停', {
    left: 473,
    top: 586,
    fontSize: 17,
    fill: 'red',
    lockMovementX: true,
    lockMovementY: true,
    lockRotation: true,
    lockScalingX: true,
    lockScalingY: true
  }));
  tipFcList.push(new fabric.Circle(
      {
        lockMovementX: true,
        lockMovementY: true,
        lockRotation: true,
        lockScalingX: true,
        lockScalingY: true,
        radius: 10, fill: 'green', left: 440, top: 615
      }
  ));
  tipFcList.push(new fabric.Text('正常', {
    left: 473,
    top: 616,
    fontSize: 17,
    fill: 'green',
    lockMovementX: true,
    lockMovementY: true,
    lockRotation: true,
    lockScalingX: true,
    lockScalingY: true
  }));

  // Train
  tipFcList.push(new fabric.Text('列车 : ', {
    left: 692,
    top: 520,
    fontSize: 20,
    fill: '#9A9A9A',
    lockMovementX: true,
    lockMovementY: true,
    lockRotation: true,
    lockScalingX: true,
    lockScalingY: true
  }));
  let normalTrain = new fabric.Rect(
      {
        left: 692,
        top: 555,
        fill: 'green',
        width: 40,
        height: 20,
        lockMovementX: true,
        lockMovementY: true,
        lockRotation: true,
        lockScalingX: true,
        lockScalingY: true,
      }
  );
  tipFcList.push(normalTrain);
  tipFcList.push(new fabric.Triangle(
      {
        left: normalTrain.left + 50,
        top: normalTrain.top,
        width: 20,
        height: 7,
        fill: 'green',
        angle: 90,
        lockMovementX: true,
        lockMovementY: true,
        lockRotation: true,
        lockScalingX: true,
        lockScalingY: true,
      }
  ));
  tipFcList.push(new fabric.Text('正常', {
    left: 749,
    top: 556,
    fontSize: 17,
    fill: 'green',
    lockMovementX: true,
    lockMovementY: true,
    lockRotation: true,
    lockScalingX: true,
    lockScalingY: true
  }));
  let errorTrain = new fabric.Rect(
      {
        left: 692,
        top: 585,
        fill: 'red',
        width: 40,
        height: 20,
        lockMovementX: true,
        lockMovementY: true,
        lockRotation: true,
        lockScalingX: true,
        lockScalingY: true
      }
  );
  tipFcList.push(errorTrain);
  tipFcList.push(new fabric.Triangle(
      {
        left: errorTrain.left + 50,
        top: errorTrain.top,
        width: 20,
        height: 7,
        fill: 'red',
        angle: 90,
        lockMovementX: true,
        lockMovementY: true,
        lockRotation: true,
        lockScalingX: true,
        lockScalingY: true
      }
  ));
  tipFcList.push(new fabric.Text('故障', {
    left: 749,
    top: 585,
    fontSize: 17,
    fill: 'red',
    lockMovementX: true,
    lockMovementY: true,
    lockRotation: true,
    lockScalingX: true,
    lockScalingY: true
  }));

  tipFcList.forEach(function (element, index, array) {
    fc.add(element);
  });
}

function paintSwitch() {
  for (let key in switchData) {
    if (switchData[key]['Content']) {
      let content = switchData[key]['Content'];
      let x = switchData[key]['OriginX'] - 70;
      let y = switchData[key]['OriginY'] - 40;
      let line = new fabric.Line([x, y, x + 10, y], {
        strokeWidth: 1,
        stroke: '#000000',
        lockMovementX: true,
        lockMovementY: true,
        lockRotation: true,
        lockScalingX: true,
        lockScalingY: true
      });
      fc.add(line);
      let text = new fabric.Text(content, {
        left: line.left,
        top: line.top,
        fontSize: switchData[key]['FontSize'],
        fill: '#17ff0a',
        lockMovementX: true,
        lockMovementY: true,
        lockRotation: true,
        lockScalingX: true,
        lockScalingY: true
      });
      // fc.add(text);
      fcSwitchTexts.push(text);
    }
  }

}

/**
 * 显示line id fc对象
 */
function showLineId() {
  document.getElementById('menu').style.visibility = 'hidden';
  for (let i in fcLineIdTexts) {
    fc.add(fcLineIdTexts[i]);
  }
  // fc.renderAll();
  context.lineId = true;
}

/**
 * 隐藏line id fc对象
 */
function hideLineId() {
  document.getElementById('menu').style.visibility = 'hidden';
  for (let i in fcLineIdTexts) {
    fc.remove(fcLineIdTexts[i]);
  }
  // fc.renderAll();
  context.lineId = false;
}

/**
 * 显示Switch id fc对象
 */
function showSwitchId() {
  document.getElementById('menu').style.visibility = 'hidden';
  for (let i in fcSwitchTexts) {
    fc.add(fcSwitchTexts[i]);
  }
  // fc.renderAll();
  context.switchId = true;
}

/**
 * 隐藏Switch id fc对象
 */
function hideSwitchId() {
  document.getElementById('menu').style.visibility = 'hidden';
  for (let i in fcSwitchTexts) {
    fc.remove(fcSwitchTexts[i]);
  }
  // fc.renderAll();
  context.switchId = false;
}

// function resolveNewData() {
//   return new Promise((resolve, reject) => {
//     axios({
//             method: 'get',
//             url: 'http://localhost:3000/newData'
//           }).then(function (response) {
//       console.log('--> newData response: ', response);
//       resolve(response.data);
//     }).catch(function (error) {
//       console.log('--> fetchATSData error: ', error);
//       reject(error);
//     });
//   });
// }

/**
 * 初始化站场数据
 */
function fetchATSData() {
  return new Promise((resolve, reject) => {

    axios({
            method: 'get',
            url: 'http://localhost:3000/linkData'
          }).then(function (response) {
      console.log('--> linkData response: ', response);
      resolve(response.data);
    }).catch(function (error) {
      console.log('--> fetchATSData error: ', error);
      reject(error);
    });

    // axios.get('/linkData').then(function (response) {
    //   console.log('--> linkData response: ', response);
    //   resolve(response.data);
    // }).catch(function (error) {
    //   console.log('--> fetchATSData error: ', error);
    //   reject(error);
    // });
  });
}

/**
 * 格式化线路数据
 * X: min: -418.956177   max: 11504.8291
 * Y: min: 638.2352      max: 1082.57776
 */
function formateLineData(graphContext) {
  let maxX = 0;
  let maxY = 0;
  let minY = 1000;
  for (let key in lineData) {
    let value = lineData[key];
    value['pointList'][0]['Y'] = value['pointList'][0]['Y'] - 500;
    value['pointList'][1]['Y'] = value['pointList'][1]['Y'] - 500;
    for (let k in value) {
      let code = k.charAt(0);
      if (code === code.toUpperCase()) {
        delete value[k];
      }
    }
    minY = value['pointList'][0]['Y'] < minY ? value['pointList'][0]['Y'] : minY;
    minY = value['pointList'][1]['Y'] < minY ? value['pointList'][1]['Y'] : minY;
    maxX = value['pointList'][0]['X'] > maxX ? value['pointList'][0]['X'] : maxX;
    maxX = value['pointList'][1]['X'] > maxX ? value['pointList'][1]['X'] : maxX;
    maxY = value['pointList'][0]['Y'] > maxY ? value['pointList'][0]['Y'] : maxY;
    maxY = value['pointList'][1]['Y'] > maxY ? value['pointList'][1]['Y'] : maxY;
  }
  // 根据长、宽初始化canvas画布，并获取canvas 2d画笔
  // cvs = graphContext.initCVS(maxX + 300, (maxY - minY) + 400);
  cvs = graphContext.initCVS(5300, (maxY - minY) + 400);
  console.log('--> formated data:', lineData);
  link.setLinkData(lineData);
}

/**
 * 数据分类整理
 */
function formateStationData() {
  for (let key in elementData) {
    if (elementData[key]['EFlag']) {
      let content = elementData[key];
      switch (elementData[key]['EFlag']) {
        case 'Station': // 车站
          stationData[key] = content;
          break;
        case 'Psd': // 屏蔽门
          psdData[key] = content;
          break;
        case 'Platform':  // 站台
          platformData[key] = content;
          break;
        case 'Switch':
          switchData[key] = content;
          break;
      }
    }
  }
}

/**
 * 移除鼠标位置提示div
 */
function removeCoorDiv() {
  if (document.getElementById('coorTip')) {
    document.body.removeChild(document.getElementById('coorTip'));
  }
}

/**
 * 关闭所有菜单
 */
function closeAllMenu() {
  if (document.getElementById('lineMenu')) {
    document.getElementById('lineMenu').style.visibility = 'hidden';
  }
  if (document.getElementById('menu')) {
    document.getElementById('menu').style.visibility = 'hidden';
  }
  if (document.getElementById('signalMenu')) {
    document.getElementById('signalMenu').style.visibility = 'hidden';
  }
  if (document.getElementById('stopMenu')) {
    document.getElementById('stopMenu').style.visibility = 'hidden';
  }
}

/**
 * canvas绘制站场
 */
function canvasPaintStation() {
  cvs.lineWidth = 10;
  cvs.beginPath();
  let linkData = link.getLinkData();
  for (let key in linkData) {
    let pointList = linkData[key]['pointList'];
    let x1 = pointList[0]['X'];
    let y1 = pointList[0]['Y'] - 500;
    let x2 = pointList[1]['X'];
    let y2 = pointList[1]['Y'] - 500;
    cvs.moveTo(x1, y1);
    cvs.lineTo(x2, y2);
    cvs.strokeStyle = '#092bff';
    cvs.stroke();
  }
}

/**
 * 绘制战场背景
 * @param canvas
 */
function tmp(canvas) {
  canvas.lineWidth = 10;
  canvas.beginPath();
  canvas.moveTo(100, 100);
  canvas.lineTo(500, 100);
  canvas.lineTo(800, 400);
  canvas.lineTo(1500, 400);
  canvas.lineTo(1700, 500);
  canvas.lineTo(2200, 500);

  canvas.moveTo(1530, 400);
  canvas.lineTo(3000, 400);

  canvas.moveTo(100, 400);
  canvas.lineTo(500, 400);
  canvas.lineTo(800, 100);
  canvas.lineTo(3000, 100);

  canvas.moveTo(530, 100);
  canvas.lineTo(770, 100);

  canvas.moveTo(530, 400);
  canvas.lineTo(770, 400);

  canvas.moveTo(2000, 390);
  canvas.lineTo(2500, 110);

  canvas.strokeStyle = '#092bff';
  canvas.stroke();

  canvas.lineWidth = 2;
  canvas.strokeStyle = '#ff1b09';
  canvas.stroke();

  /**
   * 绘制信号灯
   */
  canvas.beginPath();
  canvas.arc(625, 75, 10, 0, Math.PI * 2);
  canvas.strokeStyle = '#ff1b09';
  canvas.stroke();

  canvas.beginPath();
  canvas.arc(650, 75, 10, 0, Math.PI * 2);
  canvas.strokeStyle = '#17ff0a';
  canvas.stroke();

  canvas.beginPath();
  canvas.arc(675, 75, 10, 0, Math.PI * 2);
  canvas.strokeStyle = '#fff81a';
  canvas.stroke();
}

function isShow(id, type) {
  let boo = false;
  let list;
  switch (type) {
    case 'line':
      list = showLineList;
      break;
    case 'station':
      list = showStationList;
      break;
    case 'platform':
      list = showPlatformList;
      break;
    case 'right':
      list = rightLineList;
      break;
  }
  list.forEach(function (element, index, array) {
    if (element === id) {
      boo = true;
    }
  });
  return boo;
}

export default initStation;
