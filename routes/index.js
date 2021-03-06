// import {connection} from "../src/util/sysUtil";

// import {axios} from "../src/util/sysUtil";

let express = require('express');
let router = express.Router();
let initDate = require('../src/service/link/initDate');
let initNewData = require('../src/service/link/initNew');
// let axios = require('../src/util/sysUtil');

/* GET home page. */
module.exports = function (app) {

  app.get('/linkData', function (request, response, next) {
    initDate(data => {
      response.send(data);
    })
  });

  app.get('/newData', function (request, response, next) {
    initNewData(data => {
      response.send(data);
    })
  });

  app.get('/', function (request, response, next) {
    if (request.cookies && request.cookies.user) {
      response.render('index');
    } else {
      // 跳转至登录页面
      response.render('login');
    }
  });

  app.get('/login', function (request, response, next) {
    // connection.query('SELECT * from user', function (err, rows, fields) {
    //   if (err) {
    //     throw err;
    //   }
    //   console.log('The solution is: ', rows[0].solution)
    // });

    if (request.cookies && request.cookies.user) {
      response.render('index');
    } else {
      // 跳转至登录页面
      response.render('login');
    }
  });

  app.post('/login', function (request, response) {
    let loginForm = request.body;
    console.log('--> body:', loginForm);
    if (loginForm == null || loginForm.username == null || loginForm.password == null) {
      response.status(400);
      response.send('bad request!');
    } else {
      // axios.post('http://localhost:8000/people/login/', {
      //   username: loginForm.username,
      //   password: loginForm.password
      // }).then(function (res) {
      //   console.log('response: ', res);
      // }).then(function (error) {
      //   console.log('--> login failed:', error)
      // });

      // axios({
      //         method: 'post',
      //         url: 'http://localhost:8000/people/login/',
      //         data: {
      //           username: loginForm.username,
      //           password: loginForm.password
      //         }
      //       }).then(function (res) {
      //   console.log('response: ', res);
      // }).then(function (error) {
      //   console.log('--> login failed:', error)
      // });

      if (loginForm.username === 'admin' && loginForm.password === 'admin') {
        response.cookie('user', loginForm.username,
                        {expires: new Date(Date.now() + 24 * 3600 * 1000), httpOnly: true});
        response.send('ok!');
      } else {
        response.status(401);
        response.send('unauthorized!');
      }
    }
  });

  // todo remove
  app.get('/logout', function (request, response) {
    if (request.cookies && request.cookies.user) {
      response.cookie('user', request.cookies.user,
                      {expires: new Date(Date.now()), httpOnly: true});
      response.render('login');
    } else {
      // 跳转至登录页面
      response.render('login');
    }
  })

};
