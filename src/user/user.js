/**
 * Created by Captain on 2018/7/10 14:43.
 */
import {axios} from 'sysUtil'

let userInit = function () {
  let logoutDiv = document.getElementById('logout');
  logoutDiv.onclick = logout;
};

function logout() {

  $('#commonDialog').modal();

  // axios.get('/logout').then(function (response) {
  //   console.log('--> logout success: ', response);
  //   window.location.href = '/login';
  // }).catch(function (error) {
  //   console.log('--> logout fail:', error)
  // });
}

export {userInit};



