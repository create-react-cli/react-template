## 前言
事例一：我们在使用react的时候，会用``create-react-app``命令下载一个react的模板，然后开始在里面实现各种功能。

事例二：前几个月的时候，我偶然发现飞冰官网，浏览后觉得不错，并在其上面下载了几个模板。

那我们可能好奇两件事情：
- 这个模板是如何从一个空目录下搭建起来的呢
- 这个模板搭建起来之后，是如何定义命令行下载的呢

本文将按照我自己的一个想法、以react模板样式为基准，就这两个话题展开叙述。

## 开始搭建

### 目录
```
├─ build                     // webpack配置目录
│  ├─ webpack.base.js        // webpack公有配置
│  ├─ webpack.dev.js         // webpack开发环境配置
│  └─ webpack.prod.js        // webpack生产环境配置
├─ public                    // 模板存放目录
│  └─ index.html             // 模板html文件
├─ src                       // 项目
│  ├─ common                 // 共有方法
│  ├─ compoents              // 自封装组件
│  ├─ layouts                // 布局组件 
│  └─ pages                  // 页面
├─ App.jsx                   // 项目入口
├─ .babelrc                  // babel配置文件
├─ .browerslistrc            // 配置浏览器的兼容性范围
├─ .gitignore                // 忽略上传文件
├─ postcss.config.js         // 处理css样式前缀
├─ package.json              
├─ README.md                 // 工程搭建文档
```

### 初始化
首先，我们要创建一个空目录，然后初始化项目
``npm init -y``
执行完命令，我们会在目录中看见一个package.json文件。
![](https://user-gold-cdn.xitu.io/2019/10/9/16daff6d13f16b5b?w=596&h=36&f=png&s=5876)
### 配置package.json
我们知道，无论是项目的启动还是打包，它的命令是从package.json文件中自己定义的。在创建的模板中，有start命令-启动react，有build--将react项目打包，目前我们只配置这两个命令。

找到pakage.json文件中的scripts，像这样配置

```
"scripts": {
    "start": "webpack-dev-server --env.development --config ./build/webpack.base.js", // 启动服务
    "build": "webpack --env.production --config ./build/webpack.base.js" // 打包代码
  },
```
这样，我们完成了基础的配置，但是，我们会思考：不同的平台（Mac和Windows）是不是会出现设置环境变量不一样的问题？基于这个问题，我们找到了cross-env插件，那我们应该如何将上面配置好的scripts改进呢？
```
"scripts": {
    "start": "cross-env NODE_ENV=development webpack-dev-server --config ./build/webpack.base.js",
    "build": "cross-env NODE_ENV=production webpack --config ./build/webpack.base.js"
  },
```
配置好以后，下一步，我们就开始配置webpack
### 配置webpack


### 优化webpack配置

### 配置react-router

### 查看效果

## 命令行下载自己的模板

## 最后

