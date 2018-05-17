/**
 * Created by Captain on 2018/5/16 16:28.
 */
const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    app: path.join(__dirname, '../src/station/init/index.js')
  },
  output: {
    path: path.join(__dirname, '../static/js'),
    filename: "boudle.js"
  },
  resolve: {
    extensions: ['.js']
  },
  module: {
    rules: [{
      test: /\.js$/,
      use: "babel-loader"
    }]
  },
  plugins: [
    new webpack.BannerPlugin('@Captain版权所有，翻版必究'),
    // 为静态页面/模板引入已经打包的js文件
    new htmlWebpackPlugin({
                            filename: '../../views/index.hbs',
                            template: path.join(__dirname, '../views/init.hbs')
                          }),
  ],
};