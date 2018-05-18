/**
 * 核心控制
 * Created by Captain on 2018/5/17 8:58.
 */
import {canvas} from 'stationUtil'
import {axios} from 'sysUtil'
import initStation from 'initStation'

// 初始站场
initStation(canvas);

/*
axios测试
 */
axios.get('/http').then(function (response) {
  console.log('response: ', response);
}).catch(function (error) {
  console.log('error: ', error);
});
