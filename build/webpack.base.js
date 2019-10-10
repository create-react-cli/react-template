const path = require('path');
const merge = require('webpack-merge');
const dev = require('./webpack.dev');
const prod = require('./webpack.prod');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';

const base = {
    entry: path.resolve(__dirname, '../src/index.js'),
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: 'babel-loader'
        }, {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }]
    },
    output: {
        filename: 'js/[name].bundle.js',
        path: path.resolve(__dirname, '../dist')
    },
    resolve: {  // 引入js、jsx文件时，无需添加后缀
        extensions: ['.js', '.jsx'],        
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'html/index.html',
            template: path.resolve(__dirname, '../public/index.html'),
            hash: true,
            minify: !isDev && {
                removeAttributeQuotes: true, // 去掉属性双引号
                collapseWhitespace: true, // 将html文件折叠成一行
            }
        })
    ]
}

module.exports = () => {
    if (isDev) {
        return merge(base, dev);
    } else {
        return merge(base, prod);
    }
}
