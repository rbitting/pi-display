const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const dotEnv = require('dotenv-webpack');

module.exports = {
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'js/bundle.js',
    publicPath: '/',
    clean: true,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [
      { test: /\.(t|j)sx?$/, use: { loader: 'ts-loader' }, exclude: /node_modules/ },
      {
        test: /\.scss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      { enforce: 'pre', test: /\.js$/, exclude: /node_modules/, loader: 'source-map-loader' },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './src/index.html',
      minify: false,
      inject: 'body',
    }),
    new CopyPlugin({
      patterns: [
        {
          from: 'node_modules/@fortawesome/fontawesome-free/css/fontawesome.min.css',
          to: 'vendor/fa/css/fontawesome.min.css',
        },
        { from: 'node_modules/@fortawesome/fontawesome-free/css/regular.min.css', to: 'vendor/fa/css/regular.min.css' },
        { from: 'node_modules/@fortawesome/fontawesome-free/css/solid.min.css', to: 'vendor/fa/css/solid.min.css' },
        { from: 'node_modules/@fortawesome/fontawesome-free/css/all.min.css', to: 'vendor/fa/css/all.min.css' },
        { from: 'node_modules/@fortawesome/fontawesome-free/css/brands.min.css', to: 'vendor/fa/css/brands.min.css' },
        { from: 'node_modules/@fortawesome/fontawesome-free/webfonts', to: 'vendor/fa/webfonts/' },
        { from: 'src/assets/', to: 'assets/' },
      ],
    }),
    new dotEnv({
      path: '../.env',
    }),
  ],
  devtool: 'source-map',
};
