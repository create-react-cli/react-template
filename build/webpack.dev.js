
module.exports = {
    mode: 'development',
    optimization:{    // 开发环境下tree-shaking不生效
        usedExports: true,
    },
}