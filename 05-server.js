const express = require('express');
const app = express();
const path = require('path');
const moment = require('moment');
const fs = require('fs');
const session = require("express-session")


// 导入模板引擎模块
const artTemplate = require('art-template');
const express_template = require('express-art-template');

//配置模板的路径
app.set('views', __dirname + '/views/');
//设置express_template模板后缀为.html的文件(不设这句话，模板文件的后缀默认是.art)
app.engine('html', express_template); 
//设置视图引擎为上面的html
app.set('view engine', 'html');

//初始化session数据
app.use(session({
    name:'SESSIONID',  // session会话名称存储在cookie中的键名
    secret:'%#%￥#……%￥', // 必填项，用户session会话加密（防止用户篡改cookie）
    cookie:{  //设置session在cookie中的其他选项配置
      path:'/',
      secure:false,  //默认为false, true 只针对于域名https协议
      maxAge:60000*24,  //设置有效期为24分钟，说明：24分钟内，不访问就会过期，如果24分钟内访问了。则有效期重新初始化为24分钟。
    }
  }));

//设置托管静态资源中间件
app.use('/uploads',express.static(path.join(__dirname , '/uploads')));
app.use('/static',express.static(path.join(__dirname , '/static')));

//post参数接受中间件
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

//定义一个过滤器dateFormat
artTemplate.defaults.imports.dateFormat = function(time,format = 'YYYY-MM-DD HH:mm:ss'){
    return moment.unix(time).format(format);
}

artTemplate.defaults.imports.dealDate = function(date,format = 'YYYY-MM-DD HH:mm:ss'){
    return moment(date).format(format);
}

//设置中间件,统一校验session权限
app.use((req,res,next)=>{
    let {flag} = req.body;
    // 有些路由需要放行,既不需要校验session权限,如/login,/logout
    let path = req.path.toLowerCase(); // 转换为小写
    let unPermissionPath = ['/login','/logout','/dologin','/ajaxlogin','/register','/ajaxregister','/ajaxemail']
    if(!unPermissionPath.includes(path)){
        // console.log(req);
        // 不在放行内则需要校验
        console.log(req.path,"session校验")
        if(req.session.userInfo){
            //权限正确
            next();
        }else{
            //权限失败
            if(flag === 'ajax'){
                res.json({
                    code:30004,
                    message:"请重新登录"
                })
                return;
            }else{
                res.redirect('/login');
                return;
            }
        }
    }else{
        //正常放行的路由
        next();
    }
})

//挂载路由中间件
const router = require('./router/router.js');

app.use(router)



app.listen(3696,()=>{
    console.log('server is running at port 3696')
})


