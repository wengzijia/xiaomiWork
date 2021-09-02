// 路由 router
const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const path = require('path');
const fs = require('fs');
//图片上传模块
var multer = require('multer')

const { getUnixTime } = require('../util/tool.js')

//连接数据库
let dbConfig = require('../config/dbconfig.js')
var connection = mysql.createConnection(dbConfig);
//连接mysql
connection.connect(function (err) {
    if (err) {
        throw err;
    }
    console.log('数据库连接成功')
})


//设置上传的目录
var upload = multer({ dest: path.join(__dirname, '../uploads') })



// 导入控制器模块
const ArticleController = require('../controller/ArticleController.js')
const UserController = require('../controller/UserController.js');
const CateController = require('../controller/CateController')
const { json } = require('express');
const dbQuery = require('../model/query.js');
const dbQueryPromise = require('../model/query-promise.js')


// 后台首页
router.get('/',(req,res)=>{
    let userInfo = JSON.parse(req.session.userInfo || '{}' );
    res.render('index.html',{userInfo})
})

// 文章列表
router.get('/article', ArticleController.index)

// 文章回收站列表
router.get('/recyclelist', ArticleController.recyclelist)


//文章删除
router.get('/delete', ArticleController.delete)

//展示一个添加文章的表单页面
router.get('/add',ArticleController.add)

//实现数据添加入库
router.post('/insert',upload.single('img'),ArticleController.insert )

//实现编辑文章页面的回显操作
router.get('/edit',ArticleController.edit)

// 实现文章更新入库操作
router.post('/update', upload.single('img'),ArticleController.update)

//实现文章加入回收站
router.get('/recycle', ArticleController.recycle)


//实现文章还原
router.get('/restore',ArticleController.restore)


//展示一个上传文件的表单
router.get('/addImg',ArticleController.addImg)

// 处理文件上传
router.post('/upload', upload.single('photo'),ArticleController.upload)

//更新头像
// router.post('/uploadAvatar',upload.single('avatar'),(req,res)=>{
//     let {originalname,filename,destination} = req.file;
//     // console.log(originalname);
//     // console.log(filename);
//     // console.log(destination);
//     let ext = originalname.substring(originalname.indexOf('.')); //.png

//     // 把上传成功后的文件进行重命名
//     let oldPath = path.join(__dirname,'../','uploads',filename);
//     let newPath = path.join(__dirname,'../','uploads',filename) + ext;
//     fs.renameSync(oldPath,newPath)
//     // 把上传成功的图片路径更新到用户表中
//     let userInfo = JSON.parse(req.session.userInfo);
//     let { user_id } = userInfo; // 获取当前所登录用户user_id
//     console.log('userInfo',req.session.userInfo);

//     let avatar = 'uploads/' + filename + ext;
//     let sql = `update users set avatar = '${avatar}' where user_id = ${user_id}`;
    
//     dbQuery(sql,(err,result)=>{
//         // 更新 session 状态(解决页面刷新头像变为原来图片问题)
//         // 一、把用户的头像路径存入到session中去，要覆盖原图片
//         userInfo.avatar = avatar;
//         // 二、再存入到session中去
//         req.session.userInfo = JSON.stringify(userInfo);

//         if(err){ throw err; }
//         res.json({
//             code:20000,
//             message:"更新头像成功",
//             src: avatar
//         })
//     })
// })

router.post('/uploadAvatar',upload.single('avatar'),(req,res)=>{
    let {originalname,filename,destination} = req.file;
    // console.log(originalname);
    // console.log(filename);
    // console.log(destination);
    let ext = originalname.substring(originalname.indexOf('.')); //.png

    // 把上传成功后的文件进行重命名
    let oldPath = path.join(__dirname,'../','uploads',filename);
    let newPath = path.join(__dirname,'../','uploads',filename) + ext;
    fs.renameSync(oldPath,newPath)
    // 把上传成功的图片路径更新到用户表中
    let userInfo = JSON.parse(req.session.userInfo);
    let { user_id } = userInfo; // 获取当前所登录用户user_id
    console.log('userInfo',req.session.userInfo);

    let avatar = 'uploads/' + filename + ext;
    let sql = `update users set avatar = '${avatar}' where user_id = ${user_id}`;
    
    dbQueryPromise(sql).then(result=>{
        // 更新 session 状态(解决页面刷新头像变为原来图片问题)
        // 一、把用户的头像路径存入到session中去，要覆盖原图片
        userInfo.avatar = avatar;
        // 二、再存入到session中去
        req.session.userInfo = JSON.stringify(userInfo);
        res.json({
            code:20000,
            message:"更新头像成功",
            src: avatar
        })
    }).catch(err=>{
        if(err){ throw err; }
    })
})

//展示用户注册的页面
router.get("/register",UserController.register)


//用户登录login
router.get("/login",UserController.login)

//处理用户登录逻辑
router.post("/dologin",UserController.dologin)

//处理用户退出逻辑
router.get('/logout',UserController.logout)

//文章详情页面
router.get('/detail',ArticleController.detail)

// ajax登录
router.post('/ajaxlogin',UserController.ajaxlogin)

//用户注册入库
router.post('/ajaxregister',UserController.ajaxregister)

//校验邮箱是否占用
router.post('/ajaxemail',UserController.ajaxemail)

// ajax文章删除
router.post('/ajaxdelete',ArticleController.ajaxdelete)

// 更新用户的密码
router.post('/updatePassword',UserController.updatePassword)

// 分类列表模板展示
router.get('/catelist',CateController.list)

// 获取分类数据的api接口
router.get('/getCateData',CateController.cate)

// 删除分类
router.post('/deleteCate',CateController.delete)

//展示添加分类的页面
router.get('/addCate',CateController.addCate)

//  添加分类入库的api接口
router.post('/ajaxAddCate',upload.single(''),CateController.insertCate)

// 展示编辑分类的页面
router.get('/editCate',CateController.editCate)

// 获取当前指定的分类
router.get('/getCateDetail',CateController.detail)

// 更新分类
router.post('/updateCate',CateController.updateCate)

// 给文章添加内容展示视图
router.get('/editContent',ArticleController.editContent)

router.post('/updateArtilceContent',ArticleController.updateArtilceContent)


//导出模块
module.exports = router;