const express = require('express');
const path = require('path');
const moment = require('moment');
const mysql = require('mysql');

const app = express();

// 导入模板引擎
const artTemplate = require('art-template');
const express_template = require('express-art-template');

// 2. 连接数据库
let connection = mysql.createConnection({
    host:'127.0.0.1',
    port:3306,
    user:'root',
    password:'root',
    database:'geo'
});

connection.connect(function(err){
    if(err){
        console.log('连接失败');
        return;
    }
    console.log('连接mysql成功');
});

//配置模板引擎
app.set('views', __dirname + '/views/'); // 配置模板的路径
app.engine('html', express_template);  // 设置模板后缀为.html的文件(不设这句话，模板文件的后缀默认是.art)
app.set('view engine', 'html'); // 设置视图引擎为上面的html

// 定义过滤器（函数）
artTemplate.defaults.imports.dateFormat = function(time,format = 'YYYY-MM-DD HH:mm:ss'){
    return moment.unix(time).format(format)
}

app.get('/',(req,res)=>{
    //1.编写sql语句
    let sql = "select t1.*,t2.cate_name from article t1 left join category t2 on t1.cat_id = t2.cate_id";
    //2. 执行
    connection.query(sql,(err,rows)=>{
        //3.把结果分类给模板引擎
        console.log(rows[0])
        res.render('index.html',{articles:rows})
    })
})

app.get('/login',(req,res)=>{
    res.render('login.html',{name:"NBA"})
})

app.get('/register',(req,res)=>{
    res.render('register.html')
})

app.listen(8880,()=>{
    console.log('server is running at port 8880')
})