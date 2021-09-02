const { error } = require('console');
const express = require('express');
const app = express();

// 1. 导入mysql驱动包
const mysql = require('mysql');

// 2.连接数据库
let connection = mysql.createConnection({
    host:'localhost',
    port:3306,
    user:'root',
    password:'root',
    database:'geo'
});

connection.connect(function(err){
    if(err){
        console.error('连接失败');
        return;
    }
    console.log('连接mysql成功')
});

app.get('/select',(req,res)=>{
    let {id} = req.query;
    let sql = `select * from article where id=${id}`;
    connection.query(sql,(err,rows,fields)=>{
        if(err){ throw err;}
        console.log(fields);
        res.json(rows)
    })
})

app.get('/delete',(req,res)=>{
    let sql = "delete from category where cate_id in (8,9)";
    connection.query(sql,(err,result)=>{
        console.log(result.affectedRows)
    })
    res.end('hello delete')
})

app.get('/update',(req,res)=>{
    let sql = "update  category set cate_name = ?,is_show=? where cate_id = ?";
    let bind = ['翁',1,7];
    connection.query(sql,bind,(err,result)=>{
        console.log(result.affectedRows)
    })
    res.send('hello update')
})
app.get('/insert',(req,res)=>{
    let sql = "insert into category(cate_name,is_show) values(?,?)";
    let bind = ['章',2];
    connection.query(sql,bind,(err,result)=>{
        console.log(result.affectedRows)
    })
    res.end('hello insert')
})
app.listen(8888,()=>{
    console.log('server is running at port 8888')
})