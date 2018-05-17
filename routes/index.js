let express = require('express');
let router = express.Router();
let initDate = require('../service/link/initDate');

/* GET home page. */
module.exports = function (app) {

  app.get('/', function (req, res, next) {
    // res.render('index');
    res.json({
               message: 'hello world!'
             });
  });

  app.get('/index', function (req, res, next) {
    initDate(data => {
      res.render('index', {title: 'index'});
    });
  });

};
