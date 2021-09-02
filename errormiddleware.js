const fs = require('fs')
const { getDate } =  require('./util.js');

function errorMiddleware(err,req,res,next){
    console.log('error middleware')
    console.log(err.name); // 错误名称： ReferenceError
    console.log(err.message); // 错误信息 abc is not defined
    let data = `\n\n时间：${getDate()} - 错误名称：${err.name}--${err.message}` 
    fs.appendFileSync('./error.log',data)

    // console.log(err.stack); // 错误的堆栈，可以获取错误源头信息

    next();
}

module.exports = errorMiddleware