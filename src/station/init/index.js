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
let fcLineList = {};
let elementData,
    lineData,
    stationData = {}, // 车站
    psdData = {}, // 屏蔽门
    platformData = {},  // 站台
    fcLineIdTexts = []; // 线路id文本fc对象数组
let context = {
  lineId: true,
  switchId: false
};

/**
 * 站场初始化
 * @param graphContext
 */
let initStation = function (graphContext) {

  // 阻止浏览器右键菜单！
  document.oncontextmenu = function (event) {
    event.preventDefault();
  };

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
      coorTip.style.background = 'rgba(255, 255, 255, 0.6)';
      coorTip.innerText = content;
      document.body.appendChild(coorTip);
    }
  });

  // 监听鼠标右键
  fc.on('mouse:down', function (options) {
    let menu = document.getElementById('menu');
    if (options.button && options.button === 3) {
      removeCoorDiv(); // 先移除鼠标位置提示框
      let left = event.pageX + 15;
      let top = event.pageY + 15;
      menu.style.left = left + 'px';
      menu.style.top = top + 'px';
      menu.style.visibility = 'visible';
      let lineIdClick = document.getElementById('lineIdClick');
      if (context.lineId) {
        lineIdClick.innerText = '隐藏线路名';
        lineIdClick.onclick = hideLineId;
      } else {
        lineIdClick.innerText = '显示线路名';
        lineIdClick.onclick = showLineId;
      }
    } else if (options.button && options.button === 1) {
      menu.style.visibility = 'hidden';
    }
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
    fcLineList[linkData[key]['id']] = line;

    line.on('mousemove', function () {
      fcLineList[linkData[key]['id']].set(
          {
            stroke: '#FF1B09'
          }
      );
      let content = '线路id: ' + linkData[key]['id'];
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
        lineTip.style.width = 13 * content.length + 'px';
        lineTip.style.height = '25px';
        lineTip.style.position = 'absolute';
        lineTip.style.zIndex = 9999;
        lineTip.style.background = 'rgba(255, 255, 255, 0.6)';
        lineTip.innerText = content;
        lineTip.style.textAlign = 'center';
        document.body.appendChild(lineTip);
      }
      fc.renderAll();
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
      fc.renderAll();
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
    let content = entity['Content'];
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
        platformTip.style.background = 'rgba(255, 255, 255, 0.6)';
        platformTip.innerText = content;
        platformTip.style.textAlign = 'center';
        document.body.appendChild(platformTip);
      }
    });
    line.on('mouseout', function () {
      if (document.getElementById('platformTip')) {
        document.body.removeChild(document.getElementById('platformTip'));
      }
    });
    fc.add(line);
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
  fc.renderAll();
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
  fc.renderAll();
  context.lineId = false;
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
 * 移除鼠标位置提示div
 */
function removeCoorDiv() {
  if (document.getElementById('coorTip')) {
    document.body.removeChild(document.getElementById('coorTip'));
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
