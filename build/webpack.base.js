const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const dev = require('./webpack.dev');
const prod = require('./webpack.prod');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isDev = process.env.NODE_ENV === 'development';

const base = {
    entry: path.resolve(__dirname, '../src/index.js'),      // 入口
    module: {                                               
        rules: [{                                           // 对.js、.jsx的处理
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: 'babel-loader'
        }, {                                                // 对.css的处理
            test: /\.css$/,
            use: [
                !isDev && MiniCssExtractPlugin.loader,      // 生产环境下样式抽离
                isDev && 'style-loader',
                {
                    loader: 'css-loader',
                    options: {
                        importLoaders: 1                    // 引入的文件调用后面的loader处理
                    }
                },
                {                                           // 智能添加样式前缀
                    loader: "postcss-loader",
                    options:{
                        plugins:[require('autoprefixer')]
                    }
                },
            ].filter(Boolean)
        }, {
            test: /\.scss$/,                               // css预处理器scss的处理
            use: [
                !isDev && MiniCssExtractPlugin.loader,     // 生产环境下抽离样式
                isDev && 'style-loader',
                "css-loader",
                "sass-loader"
            ].filter(Boolean)
        }, {
            test: /\.less$/,                               // css预处理器less的处理
            use: "less-loader",
        }, {
            test: /\.stylus$/,                             // css预处理器stylus的处理                           
            use: "stylus-loader",
        }, {
            test: /\.(jpe?g|png|svg|gif)$/,                // 对图片的处理
            loader: "file-loader",
            options: {
                name: "image/[contentHash].[ext]"
            },
        }, {
            test: /\.(woff|ttf|eot|otf|ico)$/,             // 对字体图标的处理
            loader: "file-loader",
            options: {
                name: "image/[name].[ext]"
            },
        }]
    },
    output: {                                              // 出口
        filename: 'scripts/[name].bundle.js',
        path: path.resolve(__dirname, '../dist')
    },
    resolve: {                                             // 引入js、jsx文件时，无需添加后缀
        extensions: ['.js', '.jsx'],
    },
    plugins: [
        !isDev && new MiniCssExtractPlugin({               // css样式抽离
            filename: 'css/[name].[contentHash].[ext]'
        }),
        new HtmlWebpackPlugin({                            // 配置入口html
            filename: 'index.html',
            template: path.resolve(__dirname, '../public/index.html'),
            hash: true,
            inject: true,
            favicon: path.resolve(__dirname, '../public/favicon.ico'), 
            minify: !isDev && {
                removeAttributeQuotes: true,               // 去掉属性双引号
                collapseWhitespace: true,                  // 将html文件折叠成一行
            }
        }),
        new webpack.HotModuleReplacementPlugin(),
    ].filter(Boolean),
    devServer: {                                           // 配置服务
        hot:true,                                          // 热更新
        port: 3000,                                        // 端口号
        compress: true,                                    // 提升页面返回速度
        open: true,                                        // 启动服务后自动启动浏览器
        contentBase: path.resolve(__dirname, '../dist'),   // webpack启动服务会在dist目录下
    }
}

module.exports = () => {                                    // 根据环境合并webpack
    if (isDev) {
        return merge(base, dev);
    } else {
        return merge(base, prod);
    }
}