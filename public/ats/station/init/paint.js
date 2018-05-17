/**
 * Created by Captain on 2018/3/14 16:09.
 */
import axios from '../../network/netService.js'

axios.get('/').then(function (response) {
  console.log('response: ', response);
}).catch(function (error) {
  console.log('error: ', error);
});

let canvas = document.getElementById('canvas');
// canvas元素绘图表面的宽度
canvas.width = 3200;
// canvas元素绘图表面的高度
canvas.height = 600;

let cvs = canvas.getContext('2d');
// cvs.fillStyle = "#FF0000";
// cvs.fillRect(0, 0, 150, 75);

cvs.lineWidth = 10;
cvs.beginPath();
cvs.moveTo(100, 100);
cvs.lineTo(500, 100);
cvs.lineTo(800, 400);
cvs.lineTo(1500, 400);
cvs.lineTo(1700, 500);
cvs.lineTo(2200, 500);

cvs.moveTo(1530, 400);
cvs.lineTo(3000, 400);

cvs.moveTo(100, 400);
cvs.lineTo(500, 400);
cvs.lineTo(800, 100);
cvs.lineTo(3000, 100);

cvs.moveTo(530, 100);
cvs.lineTo(770, 100);

cvs.moveTo(530, 400);
cvs.lineTo(770, 400);

cvs.moveTo(2000, 390);
cvs.lineTo(2500, 110);

cvs.strokeStyle = '#092bff';
cvs.stroke();

cvs.lineWidth = 2;
cvs.strokeStyle = '#ff1b09';
cvs.stroke();

/**
 * 绘制信号灯
 */
cvs.beginPath();
cvs.arc(625, 75, 10, 0, Math.PI * 2);
cvs.strokeStyle = '#ff1b09';
cvs.stroke();

cvs.beginPath();
cvs.arc(650, 75, 10, 0, Math.PI * 2);
cvs.strokeStyle = '#17ff0a';
cvs.stroke();

cvs.beginPath();
cvs.arc(675, 75, 10, 0, Math.PI * 2);
cvs.strokeStyle = '#fff81a';
cvs.stroke();
