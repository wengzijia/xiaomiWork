const express = require('express');
const app = express();
const path = require('path');
var favicon = require('serve-favicon');
const open = require('open');
const PORT = 8000;
const morgan = require('morgan');
const notFound = require('./notFoundmiddleware');
const errMiddleware=  require('./errormiddleware.js');


//----- 配置静态资源托管 -----
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
// 静态目录
app.use('/', express.static(path.join(__dirname)));
app.use(favicon(path.join(__dirname,'favicon.ico')));
app.use((req,res,next)=>{
    console.log(abc)
    next();
})
app.use(errMiddleware)
app.use(notFound)
//----- 监听端口 -----
app.listen(PORT, () => {
    open(`http://127.0.0.1:${PORT}`)
    console.log(`server running at port ${PORT}`);
});

