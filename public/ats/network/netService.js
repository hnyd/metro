/**
 * Created by Captain on 2018/5/15 15:49.
 */
// let axios = require('axios');
import axios from 'axios'

let service = axios.create(
    {
      baseUrl: 'http://localhost:3000/',
      timeout: 10000,
      withCredentials: true
    });

export default service;
// module.exports = service;