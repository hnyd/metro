/**
 * Created by Captain on 2018/7/10 14:43.
 */
import {axios} from 'sysUtil'

let userInit = function () {
  $('#logout').click(function () {
    logout();
  });
};

function logout() {
  axios.get('/logout').then(function (response) {
    console.log('--> logout success: ', response);
    window.location.href = '/login';
  }).catch(function (error) {
    console.log('--> logout fail:', error)
  });
}

export {userInit};



