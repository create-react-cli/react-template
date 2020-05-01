const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const dev = require('./webpack.dev');
const prod = require('./webpack.prod');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PurgecssWebpackPlugin = require('purgecss-webpack-plugin');
const AddAssetHtmlCdnWebpackPlugin = require('add-asset-html-cdn-webpack-plugin');
const {
    DllReferencePlugin
} = require("webpack");
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin');
const HappyPack = require('happypack');

const isDev = process.env.NODE_ENV === 'development';

const base = {
    entry: path.resolve(__dirname, '../src/index.js'), // 入口
    module: {
        rules: [{ // 对.js、.jsx的处理
            test: /\.(js|jsx)$/,
            use: 'happypack/loader?id=js',
        }, { // 对.css的处理
            test: /\.css$/,
            use: 'happypack/loader?id=css',
        }, {
            test: /\.scss$/, // css预处理器scss的处理
            use: 'happypack/loader?id=scss',
        }, {
            test: /\.less$/, // css预处理器less的处理
            use: 'happypack/loader?id=less',
        }, {
            test: /\.stylus$/, // css预处理器stylus的处理 
            use: 'happypack/loader?id=stylus',
        }, {
            test: /\.(jpe?g|png|svg|gif)$/, // 对图片的处理
            use: [{
                    loader: "file-loader",
                    options: {
                        name: "image/[contentHash].[ext]",
                        limit: 50000, // 大于50kb的是路径，小于50kb的图片转为base64
                    },
                },
                !isDev && {
                    loader: 'image-webpack-loader',
                    options: {
                        mozjpeg: {
                            progressive: true,
                            quality: 65
                        },
                        optipng: {
                            enabled: false
                        },
                        pngquant: {
                            quality: [0.65, 0.9],
                            speed: 4
                        },
                        gifsicle: {
                            interlaced: false
                        },
                        // the webp option will enable WEBP
                        webp: {
                            quality: 75
                        }
                    }
                }
            ].filter(Boolean),
        }, {
            test: /\.(woff|ttf|eot|otf|ico)$/, // 对字体图标的处理
            loader: "file-loader",
            options: {
                name: "image/[name].[ext]"
            },
        }]
    },
    output: { // 出口
        filename: 'scripts/[name].bundle.js',
        path: path.resolve(__dirname, '../dist'),
        chunkFilename: '[name].min.js',
        publicPath: '/'
    },
    resolve: { // 引入js、jsx、json、css文件时，无需添加后缀
        extensions: ['.js', '.jsx', '.json', '.css'],
    },
    externals: {
        'jquery': '$'
    },
    plugins: [
        !isDev && new MiniCssExtractPlugin({ // css样式抽离
            filename: 'css/[name].[contentHash].css'
        }),
        !isDev && new PurgecssWebpackPlugin({
            paths: glob.sync(`${path.join(__dirname, "../src")}/**/*`, {
                nodir: true
            })
            // 不匹配目录，只匹配文件
        }),
        new HtmlWebpackPlugin({ // 配置入口html
            filename: 'index.html',
            template: path.resolve(__dirname, '../public/index.html'),
            hash: true,
            inject: true,
            favicon: path.resolve(__dirname, '../public/favicon.ico'),
            minify: !isDev && {
                removeAttributeQuotes: true, // 去掉属性双引号
                collapseWhitespace: true, // 将html文件折叠成一行
            }
        }),
        // new webpack.NamedModulesPlugin(),   // 打印更新模块
        new webpack.HotModuleReplacementPlugin(), // 热更新插件
        new AddAssetHtmlCdnWebpackPlugin(true, {
            'jquery': 'https://cdn.bootcss.com/jquery/3.4.1/jquery.js'
        }),
        new DllReferencePlugin({ // 构建时引用动态链接库
            manifest: path.resolve(__dirname, '../dll/manifest.json')
        }),
        new AddAssetHtmlWebpackPlugin({ // 手动引入react.dll.js
            filepath: path.resolve(__dirname, '../dll/react.dll.js')
        }),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/), // 忽略import、require语法
        new webpack.LoaderOptionsPlugin({
            options: {
                noParse: /jquery/, // 对类似jq这类依赖库，内部不会引用其他库，我们在打包的时候就没有必要去解析，这样能够增加打包速率  
            }
        }),
        new HappyPack({
            id: 'js',
            threads: 4,
            loaders: ['babel-loader']
        }),
        new HappyPack({
            id: 'css',
            threads: 4,
            loaders: [
                !isDev && MiniCssExtractPlugin.loader, // 生产环境下样式抽离
                isDev && 'style-loader',
                {
                    loader: 'css-loader',
                    options: {
                        importLoaders: 1 // 引入的文件调用后面的loader处理
                    }
                },
                { // 智能添加样式前缀
                    loader: "postcss-loader",
                    options: {
                        plugins: [require('autoprefixer')]
                    }
                },
            ].filter(Boolean)
        }),
        new HappyPack({
            id: 'scss',
            threads: 4,
            loaders: [
                !isDev && MiniCssExtractPlugin.loader, // 生产环境下抽离样式
                isDev && 'style-loader',
                "css-loader",
                "sass-loader"
            ].filter(Boolean)
        }),
        new HappyPack({
            id: 'less',
            threads: 4,
            loaders: ["less-loader"]
        }),
        new HappyPack({
            id: 'status',
            threads: 4,
            loaders: ["stylus-loader"]
        })
    ].filter(Boolean),

    devServer: { // 配置服务
        hot: true, // 热更新
        port: 3000, // 端口号
        historyApiFallback: true,
        compress: true, // 提升页面返回速度
        open: true, // 启动服务后自动启动浏览器
        contentBase: path.resolve(__dirname, '../dist'), // webpack启动服务会在dist目录下
        proxy: {
            '^/api': {
                target: 'http://www.baidu.com',
                pathRewrite: {
                    "^/api": ""
                },
                changeOrigin: true,
                secure: true, // 是否验证证书  true为https
            }
        },

    }
}

module.exports = () => { // 根据环境合并webpack
    if (isDev) {
        return merge(base, dev);
    } else {
        return merge(base, prod);
    }
}