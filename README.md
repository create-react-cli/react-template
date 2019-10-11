## 前言
事例一：我们在使用react的时候，会用``create-react-app``命令下载一个react的模板，然后开始在里面实现各种功能。

事例二：前几个月的时候，我偶然发现飞冰官网，浏览后觉得不错，并在其上面下载了几个模板。

那我们可能好奇两件事情：
- 这个模板是如何从一个空目录下搭建起来的呢
- 这个模板搭建起来之后，是如何定义命令行下载的呢

本文将按照我自己的一个想法、以`react`模板样式为基准，就这两个话题展开叙述。

## 一、开始搭建

### 1.1 目录
```
├─ build                     // webpack配置目录
│  ├─ webpack.base.js        // webpack共有配置
│  ├─ webpack.dev.js         // webpack开发环境配置
│  └─ webpack.prod.js        // webpack生产环境配置
├─ public                    // 模板存放目录
│  ├─ favicon.ico            // 网站图标
│  └─ index.html             // 模板html文件
├─ src                       // 项目
│  ├─ common                 // 共有方法
│  ├─ compoents              // 自封装组件
│  ├─ layouts                // 布局组件 
│  ├─ pages                  // 页面
│  ├─ index.js               // 项目入口
│  ├─ App.css                // css样式
│  ├─ logo.svg               // 项目入口
│  └─ App.jsx                
├─ .babelrc                  // babel配置文件
├─ .browerslistrc            // 配置浏览器的兼容性范围
├─ .gitignore                // 忽略上传文件
├─ package.json              
├─ README.md                 // 工程搭建文档说明
```

### 初始化
首先，我们要创建一个空目录，然后初始化项目
``npm init -y``
执行完命令，我们会在目录中看见一个`package.json`文件。
![](https://user-gold-cdn.xitu.io/2019/10/9/16daff6d13f16b5b?w=596&h=36&f=png&s=5876)
### 配置package.json
我们知道，无论是项目的启动还是打包，它的命令是从`package.json`文件中自己定义的。在创建的模板中，有`start`命令-启动`react`，有`build`-将`react`项目打包，目前我们只配置这两个命令。

找到`pakage.json`文件中的`scripts`，像这样配置

```
"scripts": {
    "start": "webpack-dev-server --env.development --config ./build/webpack.base.js",      // 开发环境启动服务,
    "dev":"webpack --env.development --config ./build/webpack.base.js",                    // 开发环境打包代码
    "build": "webpack --env.production --config ./build/webpack.base.js",                  // 生产环境打包代码
    "build:server": "webpack-dev-server --env.production --config ./build/webpack.base.js" // 生产环境启动服务
  },
```
这样，我们完成了基础的配置，但是，我们会思考：不同的平台（`Mac`和`Windows`）是不是会出现设置环境变量不一样的问题？基于这个问题，我们找到了`cross-env`插件，那我们应该如何将上面配置好的`scripts`改进呢？
```
"scripts": {
    "start": "cross-env NODE_ENV=development webpack-dev-server --config ./build/webpack.base.js",
    "dev":"cross-env NODE_ENV=development webpack --config ./build/webpack.base.js",
    "build": "cross-env NODE_ENV=production webpack --config ./build/webpack.base.js",
    "build:server": "cross-env NODE_ENV=production webpack-dev-server --config ./build/webpack.base.js"
  },
```
配置好以后，下一步，我们就开始配置webpack
### 1.4 配置webpack
#### 1.4.1 webpack.base.js
```
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
```
#### 1.4.2 webpack.dev.js
```
module.exports = {
    mode: 'development',
}
```
#### 1.4.3 webpack.prod.js
```
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    mode: 'production',
    plugins: [
        new CleanWebpackPlugin(),                         // 打包前清空dist目录
        new UglifyJsPlugin({                              // 打包后自动去除debugger、console等        
            uglifyOptions: {
                compress: {
                    drop_debugger: true,               
                    drop_console: true,
                    pure_funcs: ['console.log', 'debugger']
                }
            },
            parallel: true
        }),
    ],
}
```

### 查看效果

![](https://user-gold-cdn.xitu.io/2019/10/11/16db8c98fa8c71a0?w=599&h=374&f=gif&s=254818)
现在，我们已经实现了一个属于自己的模板，但是我们发现打包的速度可能会有一些慢。那究竟如何让自己的代码打包更快呢？

我们可以优化我们的`webpack`配置~

关于`webpack`的配置优化，后续,会单独写一个文章~

## 自定义命令下载自己的模板
我们都用过`vue-cli`、`create-react-app`等命令下载一个初始的`vue`、`react`模板，这里我要写一个属于自己的`cli`下载属于自己的模板（手动狗头）~

我的`cli`在`npm`上的名字叫`react-demo-cli`,下载模板的命令是`create-react-cli download`

所以，在使用的时候，先输入命令
```npm install react-demo-cli -g```
然后
```create-react-cli download```
就可以啦~

效果是这样婶滴

![](https://user-gold-cdn.xitu.io/2019/10/11/16dba961143b80ae?w=1132&h=684&f=png&s=525350)


## 最后
这一篇文章的核心简单来说有两条
- 配置`webpack`
- 搭建一个自己的`cli`
只要这两件事情搞定了，问题就不难了

这里，主要说了从零搭建自己的react框架的思路、方法，效果和`create-react-app`等比起来，还是差很多。所以，我会不断优化自己和自己的代码~

还有:
- 对于`cli`，只有使用方法，后续会有专门的文章讲解如何搭建一个自己的``cli``。这里还要感谢`圈圈的圈`的cli代码讲解~
- 对于`webpack`，我使用了`webpack-dev-server`来启动服务，这样启动的服务在控制台打印了很多东西，所以后续会改为自己编写脚本的方式~

下面，是`cli`和`react-template`的`github`地址

- [react-template](https://github.com/create-react-cli/react-template)
- [react-demo-cli](https://github.com/Alberqing/create-react-cli)


上面的文章如有不对之处，还请大家指点出来~我们共同进步~

最后，分享一下我的公众号「web前端日记」的二维码，欢迎前来大家关注~


![](https://user-gold-cdn.xitu.io/2019/10/11/16dbaa9e11c8023f?w=258&h=258&f=png&s=20884)