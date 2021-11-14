const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: './js/bundle.js'
    },
    resolve: {
        modules: [path.join(__dirname, 'src'), 'node_modules'],
        alias: {
            react: path.join(__dirname, 'node_modules', 'react')
        }
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: [{ loader: 'babel-loader' }, { loader: 'source-map-loader' }],
                enforce: 'pre'
            },
            {
                test: /\.scss$/i,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: './src/index.html',
            minify: false
        }),
        /* new MiniCssExtractPlugin({
            filename: './css/style.css'
        }), */
        new CopyPlugin({
            patterns: [
              { from: "node_modules/@fortawesome/fontawesome-free/css/fontawesome.min.css", to: "vendor/fa/css/fontawesome.min.css" },
              { from: "node_modules/@fortawesome/fontawesome-free/css/regular.min.css", to: "vendor/fa/css/regular.min.css" },
              { from: "node_modules/@fortawesome/fontawesome-free/css/solid.min.css", to: "vendor/fa/css/solid.min.css" },
              { from: "node_modules/@fortawesome/fontawesome-free/css/all.min.css", to: "vendor/fa/css/all.min.css" },
              { from: "node_modules/@fortawesome/fontawesome-free/webfonts", to: "vendor/fa/webfonts/" },
            ]
        })
    ],
    devtool: 'source-map'
};