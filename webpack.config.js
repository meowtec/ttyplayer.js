const path = require('path')
const ExtractTextPlugin = require("extract-text-webpack-plugin")

const min = process.argv.indexOf('-p') > -1
const minExt = min ? '.min' : ''

module.exports = {
  entry: {
    ttyplayer: path.resolve(__dirname, './src/player.js')
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist',
    filename: `[name]${minExt}.js`,
    libraryTarget: 'umd',
    library: 'TTYPlayer',
  },
  resolve: {
    extensions: ['',  '.js']
  },

  module: {
    loaders: [
      {
        test: /\.less|css$/,
        loader: ExtractTextPlugin.extract('style', 'css!less')
      },
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/
      },
      {
        test: /\.htm$/,
        loader: path.resolve(__dirname, './build/html-loader.js')
      },
    ]
  },

  plugins: [
    new ExtractTextPlugin(`[name]${minExt}.css`)
  ],

  devServer: {
    port: 18765
  },
}
