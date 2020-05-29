module.exports = {
    devServer: {
        before: require('./mock/index.js') //引入index.js，类似于请求拦截
    }
}