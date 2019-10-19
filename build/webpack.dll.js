const path = require('path');
const { DllPlugin } = require('webpack');

const NODE_ENV = process.env.NODE_ENV;

module.exports = {
    mode: NODE_ENV,
    entry: ["react", "react-dom"],
    output: {
        library: 'react',
        filename: 'react.dll.js',
        path: path.resolve(__dirname, '../dll')
    },
    plugins: [
        new DllPlugin({
            name: 'react',
            path: path.resolve(__dirname, '../dll/manifest.json')
        })
    ]
}