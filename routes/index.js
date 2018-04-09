let express = require('express');
let router = express.Router();
let initDate = require('../service/link/initDate');

/* GET home page. */
module.exports = function (app) {

  app.get('/', function (req, res, next) {
    res.render('index');
  })

  app.get('/link', function (req, res, next) {
    initDate(data => {
      res.render('link', {title: 'link'});
    });
  });

};
