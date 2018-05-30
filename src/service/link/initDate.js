/**
 * Created by Captain on 2018/3/14 15:06.
 */
let fs = require('fs');
let path = require('path');
let parser = require('xml2js').Parser({explicitArray: false, ignoreAttrs: true});

module.exports = function (callback) {
  fs.readFile(path.join(__dirname, '../../../static', 'assets', 'LinkStructClass.xml'),
              function (err, data) {
                parser.parseString(data, function (err, result) {
                  console.log('--> fs result: ', result);
                  let line = JSON.stringify(result);
                  console.log('--> line: ', line);
                  callback(line);
                });
              })
};