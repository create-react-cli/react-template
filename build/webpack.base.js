const path = require('path');
const dev = require('./webpack.dev');
const prod = require('./webpack.prod');

exports.module = (env) => {
    let isDev = env.development;

    const base = {
        entry: path.resolve(__dirname, '../App.jsx'),
        module: {
            rules: [{
                test: /\.jsx$/,
            }, {
                test: /\.js$/,
            }, {
                test: /\.html$/,
            }, {
                test: /\.(css|less|scss)$/,
            }, {
                test: /\.(jpe?g|png|gif|svg)$/,
            }]
        },
        output: {
            filename: 'bundle.js',
            path: path.resolve(__dirname, '../dist')
        },
        plugins: {
            
        }
    }

    if(isDev) {
        return merge(base, dev);
    } else {
        return merge(base, prod);
    }
}