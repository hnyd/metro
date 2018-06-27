/**
 * Created by Captain on 2018/3/14 15:06.
 */
let fs = require('fs');
let path = require('path');
let parser = require('xml2js').Parser({explicitArray: false, ignoreAttrs: true});

module.exports = function (callback) {
  new Promise((resolve, reject) => {
    let lineData, elementData;
    // 读取line数据
    fs.readFile(path.join(__dirname, '../../../static', 'assets', 'elementList.txt'),
                function (err, data) {
                  lineData = JSON.parse(data);
                  // 读取所有绘制数据
                  fs.readFile(path.join(__dirname, '../../../static', 'assets', 'element.txt'),
                              function (err, data) {
                                elementData = JSON.parse(data);
                                resolve(
                                    {
                                      lineData: lineData,
                                      elementData: elementData
                                    });
                              });
                });
  }).then(function (value) {
    callback(value);
  }, function (error) {
    console.log('--> error:', error);
  });

  // fs.readFile(path.join(__dirname, '../../../static', 'assets', 'elementList.txt'),
  //             function (err, data) {
  //               let val = JSON.parse(data);
  //               callback(val);
  //             });

};