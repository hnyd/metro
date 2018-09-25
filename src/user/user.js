/**
 * Created by Captain on 2018/7/10 14:43.
 */
import {axios} from 'sysUtil'

let userInit = function () {
  $('#logout').click(function () {
    logout();
  });
};

/**
 * 注销
 */
function logout() {
  let date = new Date();
  date.setTime(date.getTime() - 1000);
  document.cookie = 'user=xx;expires=' + date.toUTCString();
  window.location.href = '/';

  // axios.get('/logout').then(function (response) {
  //   console.log('--> logout success: ', response);
  //   window.location.href = '/login';
  // }).catch(function (error) {
  //   console.log('--> logout fail:', error)
  // });
}

export {userInit};



