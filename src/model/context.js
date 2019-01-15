/**
 * Created by Captain on 2018/7/11 16:03.
 */

let dialogType;
let running = false;
let signal = {
  "1": {
    "eFlag": "Signal",
    "id": 1,
    "x": 112,
    "y": 259,
    "whetherShow": true,
    "whetherUse": false,
    "status": 2,
    "turnoutId": 1,
    "contentName": "sgn-01",
    "contentNameX": 0,
    "contentNameY": 0,
    "wordColor": -1,
    "wordName": "黑体",
    "wordSize": 26,
    "horizontalAngle": 0
  },
  "2": {
    "eFlag": "Signal",
    "id": 2,
    "x": 112,
    "y": 440,
    "whetherShow": true,
    "whetherUse": false,
    "status": 4,
    "turnoutId": 2,
    "contentName": "sgn-02",
    "contentNameX": 0,
    "contentNameY": 0,
    "wordColor": -1,
    "wordName": "黑体",
    "wordSize": 26,
    "horizontalAngle": 0
  },
  "3": {
    "eFlag": "Signal",
    "id": 3,
    "x": 2302,
    "y": 484,
    "whetherShow": true,
    "whetherUse": false,
    "status": 0,
    "turnoutId": 3,
    "contentName": "sgn-03",
    "contentNameX": 0,
    "contentNameY": 0,
    "wordColor": -1,
    "wordName": "黑体",
    "wordSize": 26,
    "horizontalAngle": 0
  },
  "4": {
    "eFlag": "Signal",
    "id": 4,
    "x": 2457,
    "y": 216,
    "whetherShow": true,
    "whetherUse": false,
    "status": 1,
    "turnoutId": 4,
    "contentName": "sgn-04",
    "contentNameX": 0,
    "contentNameY": 0,
    "wordColor": -1,
    "wordName": "黑体",
    "wordSize": 26,
    "horizontalAngle": 0
  },
  "5": {
    "eFlag": "Signal",
    "id": 5,
    "x": 4317,
    "y": 216,
    "whetherShow": true,
    "whetherUse": false,
    "status": 4,
    "turnoutId": 5,
    "contentName": "sgn-05",
    "contentNameX": 0,
    "contentNameY": 0,
    "wordColor": -1,
    "wordName": "黑体",
    "wordSize": 26,
    "horizontalAngle": 0
  },
  "6": {
    "eFlag": "Signal",
    "id": 6,
    "x": 4520,
    "y": 484,
    "whetherShow": true,
    "whetherUse": false,
    "status": 4,
    "turnoutId": 6,
    "contentName": "sgn-06",
    "contentNameX": 0,
    "contentNameY": 0,
    "wordColor": -1,
    "wordName": "黑体",
    "wordSize": 26,
    "horizontalAngle": 0
  },
  "7": {
    "eFlag": "Signal",
    "id": 7,
    "x": 4868,
    "y": 259,
    "whetherShow": true,
    "whetherUse": false,
    "status": 4,
    "turnoutId": 7,
    "contentName": "sgn-07",
    "contentNameX": 0,
    "contentNameY": 0,
    "wordColor": -1,
    "wordName": "黑体",
    "wordSize": 26,
    "horizontalAngle": 0
  },
  "8": {
    "eFlag": "Signal",
    "id": 8,
    "x": 4868,
    "y": 440,
    "whetherShow": true,
    "whetherUse": false,
    "status": 4,
    "turnoutId": 8,
    "contentName": "sgn-08",
    "contentNameX": 0,
    "contentNameY": 0,
    "wordColor": -1,
    "wordName": "黑体",
    "wordSize": 26,
    "horizontalAngle": 0
  }
};
let stop = {
  "1": {
    "eFlag": "Stop",
    "id": 1,
    "x": 640,
    "y": 382,
    "radius": 10,
    "stageId": 3,
    "whetherShow": true,
    "whetherUse": false,
    "status": 0,
    "color": 1,
    "faultColor": -1,
    "stopColor": -1
  },
  "2": {
    "eFlag": "Stop",
    "id": 2,
    "x": 640,
    "y": 453,
    "radius": 10,
    "stageId": 4,
    "whetherShow": true,
    "whetherUse": false,
    "status": 1,
    "color": 1,
    "faultColor": -1,
    "stopColor": -1
  },
  "3": {
    "eFlag": "Stop",
    "id": 3,
    "x": 1112,
    "y": 382,
    "radius": 10,
    "stageId": 5,
    "whetherShow": true,
    "whetherUse": false,
    "status": 1,
    "color": 1,
    "faultColor": -1,
    "stopColor": -1
  },
  "4": {
    "eFlag": "Stop",
    "id": 4,
    "x": 1112,
    "y": 453,
    "radius": 10,
    "stageId": 6,
    "whetherShow": true,
    "whetherUse": false,
    "status": 1,
    "color": 1,
    "faultColor": -1,
    "stopColor": -1
  },
  "5": {
    "eFlag": "Stop",
    "id": 5,
    "x": 1559,
    "y": 382,
    "radius": 10,
    "stageId": 7,
    "whetherShow": true,
    "whetherUse": false,
    "status": 2,
    "color": 1,
    "faultColor": -1,
    "stopColor": -1
  },
  "6": {
    "eFlag": "Stop",
    "id": 6,
    "x": 1559,
    "y": 453,
    "radius": 10,
    "stageId": 8,
    "whetherShow": true,
    "whetherUse": false,
    "status": 1,
    "color": 1,
    "faultColor": -1,
    "stopColor": -1
  },
  "7": {
    "eFlag": "Stop",
    "id": 7,
    "x": 2108,
    "y": 382,
    "radius": 10,
    "stageId": 9,
    "whetherShow": true,
    "whetherUse": false,
    "status": 1,
    "color": 1,
    "faultColor": -1,
    "stopColor": -1
  },
  "8": {
    "eFlag": "Stop",
    "id": 8,
    "x": 2108,
    "y": 453,
    "radius": 10,
    "stageId": 10,
    "whetherShow": true,
    "whetherUse": false,
    "status": 2,
    "color": 1,
    "faultColor": -1,
    "stopColor": -1
  },
  "9": {
    "eFlag": "Stop",
    "id": 9,
    "x": 3048,
    "y": 382,
    "radius": 10,
    "stageId": 11,
    "whetherShow": true,
    "whetherUse": false,
    "status": 1,
    "color": 1,
    "faultColor": -1,
    "stopColor": -1
  },
  "10": {
    "eFlag": "Stop",
    "id": 10,
    "x": 3048,
    "y": 453,
    "radius": 10,
    "stageId": 12,
    "whetherShow": true,
    "whetherUse": false,
    "status": 1,
    "color": 1,
    "faultColor": -1,
    "stopColor": -1
  },
  "11": {
    "eFlag": "Stop",
    "id": 11,
    "x": 3595,
    "y": 382,
    "radius": 10,
    "stageId": 23,
    "whetherShow": true,
    "whetherUse": false,
    "status": 1,
    "color": 1,
    "faultColor": -1,
    "stopColor": -1
  },
  "12": {
    "eFlag": "Stop",
    "id": 12,
    "x": 3595,
    "y": 453,
    "radius": 10,
    "stageId": 24,
    "whetherShow": true,
    "whetherUse": false,
    "status": 1,
    "color": 1,
    "faultColor": -1,
    "stopColor": -1
  },
  "13": {
    "eFlag": "Stop",
    "id": 13,
    "x": 4096,
    "y": 382,
    "radius": 10,
    "stageId": 25,
    "whetherShow": true,
    "whetherUse": false,
    "status": 0,
    "color": 1,
    "faultColor": -1,
    "stopColor": -1
  },
  "14": {
    "eFlag": "Stop",
    "id": 14,
    "x": 4096,
    "y": 453,
    "radius": 10,
    "stageId": 26,
    "whetherShow": true,
    "whetherUse": false,
    "status": 1,
    "color": 1,
    "faultColor": -1,
    "stopColor": -1
  }
};
let turnout = {
  "1": {
    "eFlag": "Turnout",
    "id": 1,
    "lineMap": [19, 21, 20],
    "start": 20,
    "end": 19,
    "turn": 21
  },
  "2": {
    "eFlag": "Turnout",
    "id": 2,
    "lineMap": [45, 46, 47],
    "start": 46,
    "end": 45,
    "turn": 47
  },
  "3": {
    "eFlag": "Turnout",
    "id": 3,
    "lineMap": [78, 79, 80],
    "start": 78,
    "end": 79,
    "turn": 80
  },
  "4": {
    "eFlag": "Turnout",
    "id": 4,
    "lineMap": [63, 64, 65],
    "start": 64,
    "end": 63,
    "turn": 65
  },
  "5": {
    "eFlag": "Turnout",
    "id": 5,
    "lineMap": [208, 209, 210],
    "start": 208,
    "end": 209,
    "turn": 210
  },
  "6": {
    "eFlag": "Turnout",
    "id": 6,
    "lineMap": [225, 223, 226],
    "start": 225,
    "end": 223,
    "turn": 226
  },
  "7": {
    "eFlag": "Turnout",
    "id": 7,
    "lineMap": [214, 215, 216],
    "start": 214,
    "end": 215,
    "turn": 216
  },
  "8": {
    "eFlag": "Turnout",
    "id": 8,
    "lineMap": [228, 229, 230],
    "start": 228,
    "end": 229,
    "turn": 230
  }
};
let fcSignalMap = {};
let fcStopMap = {};
let errorMap = {
  "Train": {}, "Signal": {}, "Stop": {}, "Door": {}
};
let errorModel = {};

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
  },

  getSignal: function () {
    return signal;
  },

  getStop: function() {
    return stop;
  },

  getTurnout: function () {
    return turnout;
  },

  getFcSignalMap: function () {
    return fcSignalMap;
  },

  setFcSignalMap: function (map) {
    fcSignalMap = map;
  },

  getFcStopMap: function () {
    return fcStopMap;
  },

  setFcStopMap: function (map) {
    fcStopMap = map;
  },

  getErrorMap: function () {
    return errorMap;
  },

  setErrorMap: function (map) {
    errorMap = map
  },

  getErrorModel: function () {
    return errorModel;
  },

  setErrorModel: function (model) {
    errorModel = model
  }

};

export default context;
