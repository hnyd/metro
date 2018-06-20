/**
 * 站场初始化模块
 * Created by Captain on 2018/3/14 16:09.
 */

import path from 'path'
import xmlParser from 'xml2js'
import {axios} from 'sysUtil'
import link from '../../model/link.js'
import {system} from "../../util/sysUtil";

let parser = xmlParser.Parser({explicitArray: false, ignoreAttrs: true});
let cvs;

/**
 * 站场初始化
 * @param graphContext
 */
let initStation = function (graphContext) {

  // 初始化站场
  fetchATSData().then(function (value) {
    // 初始化物理数据
    formateData(value, graphContext);
    // 绘制站场
    paintStation();
  }, function (error) {
    console.log('--> error: ', error);
  });

};

/**
 * 初始化站场数据
 */
function fetchATSData() {
  return new Promise((resolve, reject) => {
    axios.get('/linkData').then(function (response) {
      console.log('--> response: ', response);
      let linkData = response.data;
      resolve(linkData);
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
function formateData(linkData, graphContext) {
  let maxX = 0;
  let maxY = 0;
  let minY = 1000;
  for (let key in linkData) {
    let value = linkData[key];
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
  console.log('--> formated data:', linkData);
  link.setLinkData(linkData);
}

/**
 * 绘制站场
 */
function paintStation() {
  cvs.lineWidth = 10;
  cvs.beginPath();
  let linkData = link.getLinkData();
  for (let key in linkData) {
    let poingList = linkData[key]['pointList'];
    let x1 = poingList[0]['X'];
    let y1 = poingList[0]['Y'] - 500;
    let x2 = poingList[1]['X'];
    let y2 = poingList[1]['Y'] - 500;
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
