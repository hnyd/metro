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

let stationLineIds = [13, 39, 24, 51, 55, 69, 58, 72, 62, 77, 84, 98, 88, 103, 126, 136, 129, 139,
                      170, 180, 174, 185, 204, 217, 207, 220];
let isStationLine = function (id) {
  let boo = false;
  stationLineIds.forEach(function (element, index, array) {
    if (element === id) {
      boo = true;
    }
  });
  return boo;
};

let alertMsg = '';

let alert = {

  primary: function (msg) {
    $('#alert-dom').alert('close');
    let content = '<div id="alert-dom" class="alert alert-primary alert-dismissible  my-alert" role="alert">\n'
                  + msg
                  + '      <button type="button" class="close btn-sm" data-dismiss="alert" aria-label="Close">\n'
                  + '        <span aria-hidden="true">&times;</span>\n'
                  + '      </button>\n'
                  + '    </div>';
    $('#my-alert').append(content);
  },

  danger: function (msg) {
    $('#alert-dom').alert('close');
    let content = '<div id="alert-dom" class="alert alert-danger alert-dismissible my-alert" role="alert">\n'
                  + msg
                  + '      <button type="button" class="close btn-sm" data-dismiss="alert" aria-label="Close">\n'
                  + '        <span aria-hidden="true">&times;</span>\n'
                  + '      </button>\n'
                  + '    </div>';

    $('#my-alert').append(content);
  }

};

export {initCVS, cvs, getFc, fabric, colorTrans, isStationLine, alert}
