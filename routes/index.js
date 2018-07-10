let express = require('express');
let router = express.Router();
let initDate = require('../src/service/link/initDate');

/* GET home page. */
module.exports = function (app) {

  app.get('/linkData', function (reqest, response, next) {
    initDate(data => {
      response.send(data);
    })
  });

  app.get('/', function (reqest, response, next) {
    if (reqest.cookies && reqest.cookies.user) {
      response.render('index');
    } else {
      // 跳转至登录页面
      response.render('login');
    }
  });

  app.get('/login', function (reqest, response, next) {
    if (reqest.cookies && reqest.cookies.user) {
      response.render('index');
    } else {
      // 跳转至登录页面
      response.render('login');
    }
  });

  app.post('/login', function (reqest, response) {

    let loginForm = reqest.body;
    console.log('--> body:', loginForm);
    if (loginForm == null || loginForm.username == null || loginForm.password == null) {
      response.status(400);
      response.send('bad request!');
    } else {
      if (loginForm.username === 'admin' && loginForm.password === 'admin') {
        response.cookie('user', loginForm.username,
                        {expires: new Date(Date.now() + 10 * 60 * 1000), httpOnly: true});
        response.send('ok!');
      } else {
        response.status(401);
        response.send('unauthorized!');
      }
    }

  })

};
