const path = require('path');

exports.module = {
    mode: 'development',
    devServer: {
        port: 8000,
        compress: true,
        contentBase: path.resolve(__dirname, '../dist'),   // webpack启动服务会在dist目录下
    }
}