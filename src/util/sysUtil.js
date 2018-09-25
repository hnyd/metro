/**
 * 系统工具类
 * Created by Captain on 2018/5/18 9:58.
 */
import axios from 'axios'
import path from 'path'
import dayjs from 'dayjs'
// import mysql from 'mysql'

let rootPath = path.join(__dirname, '../..');
let srcPath = path.join(rootPath, 'src');

/**
 * 项目系统属性
 * @type {{rootPath: *|string, srcPath: *|string}}
 */
let system = {
  rootPath,
  srcPath
};

/**
 * HTTP axois实例
 * @type {AxiosInstance}
 */
let service = axios.create(
    {
      baseUrl: 'http://localhost:8000/',
      timeout: 10000,
      withCredentials: true
    });

let timeUtil = function () {
  $('#time').text(dayjs().format('YYYY.MM.DD  HH:mm'));
  return dayjs;
}();

// let connection = mysql.createConnection(
//     {
//       host: '111.231.61.80',
//       user: 'root',
//       password: 'abcd1234',
//       database: 'metro'
//     });
// connection.connect();

export {
  system,
  service as axios,
  timeUtil
  // connection
};