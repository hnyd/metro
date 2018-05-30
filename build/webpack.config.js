/**
 * Created by Captain on 2018/5/16 16:28.
 */
const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

let rootPath = path.join(__dirname, '..');
let srcPath = path.join(rootPath, 'src');

module.exports = {
  mode: 'development',
  target: "web",
  entry: {
    app: path.join(srcPath, 'main.js')
  },
  output: {
    path: path.join(rootPath, 'static/js'),
    filename: "boudle.js"
  },
  resolve: {
    extensions: ['.js'],
    alias: {
      netService: path.join(srcPath, 'network/netService.js'),
      initStation: path.join(srcPath, 'station/init/index.js'),
      stationUtil: path.join(srcPath, 'util/stationUtil.js'),
      sysUtil: path.join(srcPath, 'util/sysUtil.js')
    }
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: "babel-loader"
    }]
  },
  plugins: [
    new webpack.BannerPlugin('版权所有，翻版必究@Captain'),
    // 为静态页面/模板引入已经打包的js文件
    new htmlWebpackPlugin({
                            filename: path.join(rootPath, 'views/index.hbs'),
                            template: path.join(rootPath, 'views/init.hbs')
                          }),
  ],
};