const path = require('path');
const merge = require('webpack-merge');
const dev = require('./webpack.dev');
const prod = require('./webpack.prod');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

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
            use: [
                !isDev && MiniCssExtractPlugin.loader,       // 样式抽离
                isDev && 'style-loader', 
                {
                    loader:'css-loader',
                    options: {
                        importLoaders: 1                     // 引入的文件调用后面的loader处理
                    }
                },
                "postcss-loader",                            // 样式前缀
            ].filter(Boolean)
        }, {
            test: /\.scss$/,
            use: [
                !isDev && MiniCssExtractPlugin.loader,
                isDev && 'style-loader',
                "css-loader",
                "sass-loader"
            ].filter(Boolean)
        }, {
            test: /\.less$/,
            use: "less-loader",
        }, {
            test: /\.stylus$/,
            use: "stylus-loader",
        }, {
            test: /\.(jpe?g|png|svg|gif)$/,
            use: {
                loader: "file-loader",
            }
        }, {
            test: /\.(woff|ttf|eot|otf)$/,
            use: "file-loader"
        }]
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, '../dist')
    },
    resolve: {  // 引入js、jsx文件时，无需添加后缀
        extensions: ['.js', '.jsx'],        
    },
    plugins: [
        !isDev && new MiniCssExtractPlugin({
            filename: 'css/[name].[contentHash].css'
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.resolve(__dirname, '../public/index.html'),
            hash: true,
            minify: !isDev && {
                removeAttributeQuotes: true, // 去掉属性双引号
                collapseWhitespace: true, // 将html文件折叠成一行
            }
        })
    ].filter(Boolean)
}

module.exports = () => {
    if (isDev) {
        return merge(base, dev);
    } else {
        return merge(base, prod);
    }
}
