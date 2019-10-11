const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const dev = require('./webpack.dev');
const prod = require('./webpack.prod');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

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
                !isDev && MiniCssExtractPlugin.loader, // 样式抽离
                isDev && 'style-loader',
                {
                    loader: 'css-loader',
                    options: {
                        importLoaders: 1 // 引入的文件调用后面的loader处理
                    }
                },
                "postcss-loader", // 样式前缀
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
            loader: "file-loader",
            options: {
                name: "image/[contentHash].[ext]"
            },
        }, {
            test: /\.(woff|ttf|eot|otf|ico)$/,
            loader: "file-loader",
            options: {
                name: "image/[name].[ext]"
            },
        }]
    },
    output: {
        filename: 'scripts/[name].bundle.js',
        path: path.resolve(__dirname, '../dist')
    },
    resolve: { // 引入js、jsx文件时，无需添加后缀
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
            inject: true,
            favicon: path.resolve(__dirname, '../public/favicon.ico'), // 添加小图标
            minify: !isDev && {
                removeAttributeQuotes: true, // 去掉属性双引号
                collapseWhitespace: true, // 将html文件折叠成一行
            }
        }),
        new UglifyJsPlugin({
            uglifyOptions: {
                compress: {
                    drop_debugger: true, // console
                    drop_console: true,
                    pure_funcs: ['console.log'] // 移除console
                }
            },
            parallel: true
        }),
        new webpack.HotModuleReplacementPlugin(),
    ].filter(Boolean),
    devServer: {
        hot:true,                                        // 热更新
        port: 3000,                                      // 端口号
        compress: true,                                  // 提升页面返回速度
        open: true,                                      // 启动服务后自动启动浏览器
        contentBase: path.resolve(__dirname, '../dist'), // webpack启动服务会在dist目录下
    }
}

module.exports = () => {
    if (isDev) {
        return merge(base, dev);
    } else {
        return merge(base, prod);
    }
}