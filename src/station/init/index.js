/**
 * 站场初始化模块
 * Created by Captain on 2018/3/14 16:09.
 */

import path from 'path'
import xmlParser from 'xml2js'
import {axios} from 'sysUtil'
import {colorTrans} from "stationUtil"
import link from '../../model/link.js'
import {system} from "../../util/sysUtil";

import {fabric} from 'fabric'

let parser = xmlParser.Parser({explicitArray: false, ignoreAttrs: true});
let cvs;
let fc;
let fcLineList = [];
let elementData,
    lineData,
    stationData = {}, // 车站
    psdData = {}, // 屏蔽门
    platformData = {};  // 站台

/**
 * 站场初始化
 * @param graphContext
 */
let initStation = function (graphContext) {

  // 初始化站场
  fetchATSData().then(function (value) {
    lineData = value.lineData;
    elementData = value.elementData;

    // 初始化物理数据
    formateData(graphContext);

    // 绘制站场
    // canvasPaintStation();

    paint();

  }, function (error) {
    console.log('--> error: ', error);
  });

};

function formateData(graphContext) {
  // 初始化线路
  formateLineData(graphContext);
  // 数据分类整理
  formateStationData();
}

function paint() {
  // 初始化fabric
  initFabric();

  paintLine();
  paintStation();
  paintPsd();
  paintPlatform();
}

/**
 * 初始化fabric绘图工具
 */
function initFabric() {
  fc = new fabric.Canvas('canvas');
  // create a rectangle object
  // var rect = new fabric.Rect(
  //     {
  //       left: 100,
  //       top: 100,
  //       fill: '#FFFFFF',
  //       width: 20,
  //       height: 20,
  //
  //     });
  // rect.on('selected', function() {//选中监听事件
  //   console.log('selected a rectangle');
  // });
  // // "add" rectangle onto canvas
  // fc.add(rect);

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

  fc.on('mouse:over', function (options) {
    if (options.target && options.target.stroke) {
      // options.target.stroke = '#FF1B09';
      console.log('--> set option stroke to red!');
      options.target.set(
          {
            stroke: '#FF1B09'
          });
      // let path = new fabric.Path('M ' + options.target.x1 + ' ' + options.target.y1
      //                            + ' L ' + options.target.x2 + ' ' + options.target.y2 + ' z');
      // path.set({stroke: 'green', opacity: 0.5});
      // fc.add(path);
    }
    console.log('--> options: ', options);
  });
  fc.on('mouse:out', function (options) {
    if (options.target && options.target.stroke) {
      // options.target.stroke = '#FF1B09';
      console.log('--> set option stroke to blue!');
      options.target.set(
          {
            stroke: '#092bff'
          });
    }
    console.log('--> options: ', options);
  });
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
    let pointList = linkData[key]['pointList'];
    let x1 = pointList[0]['X'];
    let y1 = pointList[0]['Y'] - 500;
    let x2 = pointList[1]['X'];
    let y2 = pointList[1]['Y'] - 500;
    let line = new fabric.Line([x1, y1, x2, y2], option);
    fcLineList.push(line);
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
  }
}

/**
 * 绘制车站
 */
function paintStation() {
  for (let key in stationData) {
    if (stationData[key]['Content']) {
      let content = stationData[key]['Content'];
      let x = stationData[key]['OriginX'];
      let y = stationData[key]['OriginY'];
      let line = new fabric.Line([x, y, x + 10, y], {
        strokeWidth: 1,
        stroke: '#5a5a5a',
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
    let entity = psdData[key];
    let x = entity['OriginX'] - 100;
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
    let entity = platformData[key];
    let x = entity['OriginX'] - 100;
    let y = entity['OriginY'] - 63;
    option['strokeWidth'] = entity['Height'];
    let width = entity['width'];
    let line = new fabric.Line([x, y, x + width, y], option);
    fc.add(line);
  }
}

/**
 * 初始化站场数据
 */
function fetchATSData() {
  return new Promise((resolve, reject) => {
    axios.get('/linkData').then(function (response) {
      console.log('--> response: ', response);
      resolve(response.data);
    }).catch(function (error) {
      console.log('--> fetchATSData error: ', error);
      reject(error);
    });
  });
}

/**
 * 格式化数据
 * X: min: -418.956177   max: 11504.8291
 * Y: min: 638.2352      max: 1082.57776
 */
function formateLineData(graphContext) {
  let maxX = 0;
  let maxY = 0;
  let minY = 1000;
  for (let key in lineData) {
    let value = lineData[key];
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
  cvs = graphContext.initCVS(maxX + 300, (maxY - minY) + 400);
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
      }
    }
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

export default initStation;
