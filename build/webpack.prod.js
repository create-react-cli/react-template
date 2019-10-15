const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const optimizeCssAssetsWebpackPlugin= require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin= require('terser-webpack-plugin');

module.exports = {
    mode: 'production',
    optimization: {                                        // 压缩方案
        minimizer: [
            new TerserWebpackPlugin(),
            new optimizeCssAssetsWebpackPlugin(),
        ]
    },
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