/**
 * Created by Captain on 2018/3/14 15:06.
 */
let fs = require('fs');
let path = require('path');
let parser = require('xml2js').Parser({explicitArray: false, ignoreAttrs: true});
let link = require('./link');

module.exports = function (callback) {
  fs.readFile(path.join(__dirname, '../../public', 'basic', 'LinkStructClass.xml'),
              function (err, data) {
                parser.parseString(data, function (err, result) {
                  // console.log(result);
                  link.setList(result);
                  console.log(link.getList());
                  let line = JSON.stringify(result);
                  callback(line);
                });
              })
};