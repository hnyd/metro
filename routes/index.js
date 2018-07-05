let express = require('express');
let router = express.Router();
let initDate = require('../src/service/link/initDate');

/* GET home page. */
module.exports = function (app) {

  app.get('/main', function (req, res, next) {
    res.render('index', {title: 'index'});
  });

  app.get('/linkData', function (req, res, next) {
    initDate(data => {
      res.send(data);
    })
  });

  app.get('/', function (req, res, next) {
    if (req.session && req.session.user) {
      res.render('index');
    } else {
      // 跳转至登录页面
      res.render('login');
    }
  });

  app.post('/login', function (req, res) {

    let loginForm = req.body;
    console.log('--> body:', loginForm);
    if (loginForm == null || loginForm.username == null || loginForm.password == null) {
      res.status(400);
      res.send('bad request!');
    } else {
      if (loginForm.username === 'admin' && loginForm.password === 'admin') {
        res.cookie('user', loginForm.username, { expires: new Date(Date.now() + 10 * 60 * 1000), httpOnly: true });
        res.send('ok!');
      } else {
        res.status(401);
        res.send('unauthorized!');
      }
    }

  })

};
