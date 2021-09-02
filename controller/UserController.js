
const dbQuery = require("../model/query.js")
const dbQueryPromise = require("../model/query-promise.js")
let CryptoJS = require('crypto-js');
let {secret} = require('../config/config.js')
let {getNowDate} = require('../util/tool.js')
let UserController = {};

//输出一个登录表单页面
UserController.login = (req,res) => {
    // 判断是否登录
    if(req.session.userInfo){
        res.redirect('/')
    }else{
        res.render('login.html')
    }
} 

// UserController.dologin = (req,res) => {
//     // 1.接受用户信息
//     let {username,password} = req.body;
//     console.log(username,password)
//     // 2.去数据库匹配此用户信息是否正确
//     if(username === "wengzijia" && password === "123456"){
//         //把用户信息存放在session中,session只能存放字符串信息，对象和数组需要转成字符串在存储
//         req.session.userInfo = JSON.stringify({username,password})
//         res.redirect('/')
//     }else{
//         res.redirect('/login')
//     }
//     // 3.如果正确，把用户信息存储到session中,失败则打回登录页面
// }

UserController.dologin = (req,res) => {
    // 1.接受用户信息
    let {username,password} = req.body;
    password = CryptoJS.MD5(`${password}${secret}`).toString()
    console.log(username,password)
    // 2.去数据库匹配此用户信息是否正确
   let sql = `select * from users where username = '${username}' and password = '${password}'`;
   //调用模型Model方法操作数据库 
    dbQuery(sql,(err,rows)=>{
        console.log(rows)
        if(rows.length > 0){
            //把用户信息存放在session中,session只能存放字符串信息，对象和数组需要转成字符串在存储
            let userInfo = rows[0];
            req.session.userInfo = JSON.stringify(userInfo)
            //  更新用户最后的登录时间
            let sql2 = `update users set last_login_date = '${getNowDate()}' where user_id = ${userInfo.user_id}`;
            dbQuery(sql2,(err,result)=>{
                if(err){ throw err }
                res.redirect('/')
            })
   
        }else{
            res.send("<script>alert('用户名或密码错误');location.href = '/login'</script>")
            res.redirect('/login')

        }
    })


    // 3.如果正确，把用户信息存储到session中,失败则打回登录页面
}
// UserController.ajaxlogin = (req,res) => {
//     // 1.接受用户信息
//     let {username,password} = req.body;
//     password = CryptoJS.MD5(`${password}${secret}`).toString()
//     console.log(username,password)
//     // 2.去数据库匹配此用户信息是否正确
//    let sql = `select * from users where username = '${username}' and password = '${password}'`;
//    //调用模型Model方法操作数据库 
//     dbQuery(sql,(err,rows)=>{
//         console.log(rows)
//         if(rows.length > 0){
//             //把用户信息存放在session中,session只能存放字符串信息，对象和数组需要转成字符串在存储
//             let userInfo = rows[0];
//             req.session.userInfo = JSON.stringify(userInfo)
//             //  更新用户最后的登录时间
//             let sql2 = `update users set last_login_date = '${getNowDate()}' where user_id = ${userInfo.user_id}`;
//             dbQuery(sql2,(err,result)=>{
//                 if(err){ throw err }
//                 // res.redirect('/')
//                 res.json({
//                     message:'succes',
//                     code:20000
//                 })
//             })
   
//         }else{
//             // res.send("<script>alert('用户名或密码错误');location.href = '/login'</script>")
//             // res.redirect('/login')
//             res.json({
//                 message:'fail',
//                 code:-1
//             })
//         }
//     })


//     // 3.如果正确，把用户信息存储到session中,失败则打回登录页面
// }


UserController.ajaxlogin = (req,res) => {
    // 1.接受用户信息
    let {username,password} = req.body;
    password = CryptoJS.MD5(`${password}${secret}`).toString()
    console.log(username,password)
    // 2.去数据库匹配此用户信息是否正确
   let sql = `select * from users where username = '${username}' and password = '${password}'`;
   //调用模型Model方法操作数据库 
    dbQueryPromise(sql).then(rows=>{
        console.log(rows)
        if(rows.length > 0){
            //把用户信息存放在session中,session只能存放字符串信息，对象和数组需要转成字符串在存储
            let userInfo = rows[0];
            req.session.userInfo = JSON.stringify(userInfo)
            //  更新用户最后的登录时间
            let sql2 = `update users set last_login_date = '${getNowDate()}' where user_id = ${userInfo.user_id}`;
            dbQueryPromise(sql2).then(result=>{
                // res.redirect('/')
                res.json({
                    message:'succes',
                    code:20000
                })
            }).catch(err=>{
                console.log(err)
            })
   
        }else{
            // res.send("<script>alert('用户名或密码错误');location.href = '/login'</script>")
            // res.redirect('/login')
            res.json({
                message:'fail',
                code:-1
            })
        }
    })


    // 3.如果正确，把用户信息存储到session中,失败则打回登录页面
}

// 用户退出逻辑
UserController.logout = (req,res) => {
    // 1. 清除用户session信息
    req.session.destroy((err)=>{
        if(err){
            throw err
        }
    })
    // 2. 重定向到登录页面
    res.redirect('/login')
}

// 输出注册页面
UserController.register = (req,res) => {
    res.render('register.html')
}

// ajax注册
UserController.ajaxregister = (req,res) => {
    // 1.接受参数
    let {username,email,password,repassword} = req.body;
    // 2.参数校验
    if([username,email,password,repassword].includes('')){
        res.json({
            message:"参数不能为空",
            code:-1
        })
        return;
    }
    if(password !== repassword){
        res.json({
            message:"两次密码不一致",
            code: -2
        })
        return;
    }
    // 3. 入库
    password = CryptoJS.MD5(`${password}${secret}`).toString();
    let last_login_date = getNowDate();
    let sql = `insert into users(username,password,email,last_login_date) value('${username}','${password}','${email}','${last_login_date}')`;
    dbQueryPromise(sql).then(result=>{
        if(result.affectedRows){
            res.json({
                code:20000,
                message:"success"
            })
        }else{
            res.json({
                code:-3,
                message:"服务器繁忙，请稍后再试"
            })
        }
    })
}

// ajax邮箱
UserController.ajaxemail = (req,res) => {
    let {email} = req.body;
    let sql = `select * from users where email =  '${email}'`;
    dbQueryPromise(sql).then(rows=>{
        if(rows.length  > 0){
            res.json({
                code:-5,
                message:"邮箱被占用"
            })
        }else{
            res.json({
                code:20000,
                message:"邮箱可用"
            })
        }
    })
}



// 修改密码
// UserController.updatePassword = (req,res) => {
//     let {oldpwd,newpwd,renewpwd} = req.body;
//     // 1.校验原密码是否一致
//     let {user_id} = JSON.parse(req.session.userInfo);
//     let sql = `select password from users where user_id = ${user_id}`;
//     dbQuery(sql,(err,result)=>{
//         if(result.length){
//             oldpwd = CryptoJS.MD5(`${oldpwd}${secret}`).toString();
//             console.log(oldpwd);
//             if(result[0].password !== oldpwd){
//                 // 2.原密码输入错误
//                 res.json({
//                     code:-1,
//                     message:"原密码输入错误"
//                 })
//             }else{
//                 // 3.原密码一致才更新新密码
//                 newpwd = CryptoJS.MD5(`${newpwd}${secret}`).toString();
//                 let sql = `update users set password = '${newpwd}' where user_id=${user_id}`;
//                 dbQuery(sql,(err,result)=>{
//                     if(result.affectedRows){
//                         res.json({
//                             code:20000,
//                             message:"更新密码成功"
//                         })
//                     }else{
//                         res.json({
//                             code:-2,
//                             message:"服务器繁忙,请稍后再试"
//                         })
//                     }
//                 })
//             }
//         }
//     })
// }

UserController.updatePassword = (req,res) => {
    let {oldpwd,newpwd,renewpwd} = req.body;
    // 1.校验原密码是否一致
    let {user_id} = JSON.parse(req.session.userInfo);
    let sql = `select password from users where user_id = ${user_id}`;
    dbQueryPromise(sql).then(result=>{
        if(result.length){
            oldpwd = CryptoJS.MD5(`${oldpwd}${secret}`).toString();
            console.log(oldpwd);
            if(result[0].password !== oldpwd){
                // 2.原密码输入错误
                res.json({
                    code:-1,
                    message:"原密码输入错误"
                })
            }else{
                // 3.原密码一致才更新新密码
                newpwd = CryptoJS.MD5(`${newpwd}${secret}`).toString();
                let sql = `update users set password = '${newpwd}' where user_id=${user_id}`;
                return dbQueryPromise(sql)
            }
        }
    }).then(result=>{
        if(result.affectedRows){
            res.json({
                code:20000,
                message:"更新密码成功"
            })
        }else{
            res.json({
                code:-2,
                message:"服务器繁忙,请稍后再试"
            })
        }
    })
}
module.exports = UserController