/**
 * Created by Captain on 2018/5/17 16:39.
 */
let canvas = document.getElementById('canvas');
// canvas元素绘图表面的宽度
canvas.width = 3200;
// canvas元素绘图表面的高度
canvas.height = 600;
let cvs = canvas.getContext('2d');

export {cvs as canvas}