/**
 * 站场模块工具
 * Created by Captain on 2018/5/17 16:39.
 */
import {fabric} from 'fabric'

// 绘图工具canvas 2d
let canvas = document.getElementById('canvas');
let cvs;
let fc;

let getFc = function () {
  if (!fc) {
    fc = new fabric.Canvas('canvas');
  }
  return fc;
};

/**
 * 初始化canvas画布
 * @param width
 * @param heigh
 * @returns canvas 2d画笔
 */
let initCVS = function (width, heigh) {
  // canvas元素绘图表面的宽度
  canvas.width = width;
  // canvas元素绘图表面的高度
  canvas.height = heigh;
  cvs = canvas.getContext('2d');
  return cvs;
};

/**
 * 将十进制颜色转换为十六进制
 * @param colorString
 * @returns 颜色16进制格式，like "#FFFFFF"
 */
let colorTrans = function (colorString) {
  if (colorString.startsWith('-')) {
    colorString = colorString.substring(1, colorString.length);
  }
  const colorInt = parseInt(colorString, 10);
  if (colorInt > 16777215) {
    console.log('--> [ERROR]', 'the color value is out of bounds (FFFFFF)');
    return '#FFFFFF';
  } else {
    const colorHex = colorInt.toString(16);
    return '#' + colorHex;
  }
};

export {initCVS, cvs, getFc, fabric, colorTrans}