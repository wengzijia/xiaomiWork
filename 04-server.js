const express = require('express');
const path = require('path');
const mysql = require('mysql');
const moment = require('moment');

const artTemplate = require('art-template');
const express_template = require('express-art-template');

const app = express();

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

//配置模板的路径
app.set('views', __dirname + '/views/');
//设置express_template模板后缀为.html的文件(不设这句话，模板文件的后缀默认是.art)
app.engine('html', express_template); 
//设置视图引擎为上面的html
app.set('view engine', 'html');

//定义一个过滤器dateFormat
artTemplate.defaults.imports.dateFormat = function(time,format = 'YYYY-MM-DD HH:mm:ss'){
    return moment.utc(time).utcOffset(8).format(format)
}

//连接数据库
var connection = mysql.createConnection({
    host    :"localhost", //主机
    port    :'3306',	//端口
    user    :"root",	//用户名
    password:"root",	//密码
    database:"geo"		//数据库
});

//连接mysql
connection.connect(function(err){
    if(err){
        throw err;
    }
    console.log('数据库连接成功')
})

// 只要是一种映射的数据关系，都可以用对象形式来简化if elseif
let statusTextMap = {
    0: '<span class="c-gray">待审核</span>',
    1: '<span class="c-green">审核通过</span>',
    2: '<span class="c-red">审核失败</span>'
}

// 文章列表
app.get('/',(req,res)=>{
    // 1. 编写sql语句
    let sql = `select c1.*,c2.name from article_table c1 left join classification c2 on c1.cat_id = c2.id  ORDER BY c1.id  desc`;
    // 2. 执行sql
    connection.query(sql,(err,rows)=>{
        console.log('异步回调')
        console.log(rows); // [{title,status},{}]
        let data = rows.map((item)=>{
            item.status_text = statusTextMap[item.isverify]
            return item;
        })
        console.log(data)
        // 3. 把查询出来的数据分配到模板引擎中
        res.render('index.html',{article:data})
    })
    
})

//文章删除
app.get('/delete',(req,res)=>{
    //1.接受要删除的文章的id
    let {id} = req.query;
    //2.编写sql语句，删除
    let sql = `delete from article_table where id = ${id}`;
    connection.query(sql,(err,result)=>{
        //3.判断结果
        if(result.affectedRows){
            //删除成功，重定向到首页
            res.redirect('/')
        }else{
            //删除失败，响应js代码，让浏览器执行
            res.send("<script>alert('删除失败');location.href = '/';</script>")
        }
    })
})

// 展示一个添加文章的表单页面
app.get('/add',(req,res)=>{
    //取出所有的分类数据分配到模板中
    let sql ="select * from classification";
    connection.query(sql,(err,rows)=>{
        res.render('add.html',{cats:rows})
    })
})

// 实现数据添加入库
app.post('/insert',(req,res)=>{
    // 1.接受post参数
    let {title,author,cat_id,content} = req.body
    // 2.编写sql语句插入到文章表中
    let sql = 'insert into article_table(title,author,cat_id,content) values(?,?,?,?)';
    let bind = [title,author,cat_id,content]
    connection.query(sql,bind,(err,result)=>{
        // 3.判断结果
        if(result.affectedRows){
            res.send("<script>alert('成功');location.href='/';</script>")
        }else{
            res.send("<script>alert('失败');location.href='/add';</script>")
        }
    })
    
    // res.send('入库中....')
})
app.listen(4444,()=>{
    console.log('server is running at port 4444')
})

