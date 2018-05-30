let express = require('express');
let router = express.Router();
let initDate = require('../src/service/link/initDate');

/* GET home page. */
module.exports = function (app) {

  app.get('/', function (req, res, next) {
    res.render('index', {title: 'index'});
  });

  app.get('/http', function (req, res, next) {
    res.json({
               message: 'hello world!'
             });
  });

  app.get('/linkData', function (req, res, next) {
    initDate(data => {
      res.send(data);
    })
  })

};
