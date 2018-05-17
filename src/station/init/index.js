/**
 * Created by Captain on 2018/3/14 16:09.
 */
import {canvas} from '../util'

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
