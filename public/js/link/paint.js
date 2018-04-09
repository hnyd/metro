/**
 * Created by Captain on 2018/3/14 16:09.
 */
// let link = require('/service/link/link');
// import link from '/service/link/link';
// import test from '../../../service/link/test';
let canvas = document.getElementById('canvas');

canvas.width = 1800;
canvas.height = 500;


let cvs = canvas.getContext('2d');
// cvs.fillStyle = "#FF0000";
// cvs.fillRect(0, 0, 150, 75);


cvs.lineWidth = 10;
cvs.beginPath();
cvs.moveTo(100,100);
cvs.lineTo(1500,100);
cvs.moveTo(100,400);
cvs.lineTo(1500,400);
cvs.strokeStyle= '#092bff';
cvs.stroke();

