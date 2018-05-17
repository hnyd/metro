/**
 * Created by Captain on 2018/5/17 8:58.
 */
import axios from './network/netService'

/*
axios测试
 */
axios.get('/http').then(function (response) {
  console.log('response: ', response);
}).catch(function (error) {
  console.log('error: ', error);
});
