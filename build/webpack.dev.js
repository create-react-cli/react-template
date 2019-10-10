const path = require('path');

module.exports = {
    mode: 'development',
    devServer: {
        hot:true,                                        // 热更新
        port: 3000,                                      // 端口号
        compress: true,                                  // 提升页面返回速度
        open: true,                                      // 启动服务后自动启动浏览器
        contentBase: path.resolve(__dirname, '../dist'), // webpack启动服务会在dist目录下
    }
}