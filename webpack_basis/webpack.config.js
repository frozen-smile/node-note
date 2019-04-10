const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack')

module.exports = {
  entry: {
     app: './src/index.js',
//   print: './src/print.js'
  },
  //指向发生错误的具体文件
  devtool: 'inline-source-map',
  //建立实时刷新服务器，端口号8080，可访问文件目录为./dist
  devServer: {
    contentBase: './dist',
    hot: true, //热加载为true
  },
  output: {
  	//输出文件的名字， name是entry下的key值
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  module: {
      rules: [
          {
              test: /\.css$/,
              use: ['style-loader','css-loader']
          },
      ]
  },
  plugins: [
      //该插件会把输出的js自动插入到HTML中
      new HtmlWebpackPlugin({
          title: 'Output Management'
      }),
      //该插件会清理dist文件夹内多余的文件
      new CleanWebpackPlugin(['dist']),
      //模块热加载插件
      new HtmlWebpackPlugin({
          title: '模块热替换'
      }),
      new webpack.HotModuleReplacementPlugin()
  ],

};