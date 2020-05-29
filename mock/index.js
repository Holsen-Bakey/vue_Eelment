const fs = require('fs')
const path = require('path')
const JSON5 = require('json5')
const Mock = require('mockjs')

function getJsonFile(filePath) {
    //读取指定接送文件
    var json = fs.readFileSync(path.resolve(__dirname, filePath), 'utf-8')
        //解析并返回
    return JSON5.parse(json)
}

//返回一个函数
module.exports = function(app) {
    //.env.development 文件中控制开关
    if (process.env.MOCK == 'true') {
        app.get('/user/userinfo', function(rep, res) {
            //每次响应请求时读取mock data的json文件
            // getJsonFile 方法定义了如何读取json文件并解析成数据对象
            var json = getJsonFile('./userInfo.json5');
            res.json(Mock.mock(json))
        })


    }


}

// 发送请求
// axios.get('/user/userinfo')
//   .then(res => {
//     console.log(res)
//   })
//   .catch(err => {
//     console.log(err)
//   })
//   }