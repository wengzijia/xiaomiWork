const CateController = {};
const { json } = require("express");
const queryPromise = require("../model/query-promise.js");
const {dateFormat,getNowDate} = require('../util/tool.js')

CateController.list = (req,res) => {
    // 取出session中的用户信息
    let userInfo = JSON.parse(req.session.userInfo || '{}' );
    // console.log(userInfo)
    res.render('cate-list.html',{userInfo})
    
}



CateController.cate = async (req,res) => {
    // 1.获取所有分类
    let sql = "select * from classification  order by id desc";
    let result = await queryPromise(sql)
        // 2.返回json数据响应给调用者
    result.forEach(item=>{
        item['addtime'] = dateFormat( item['addtime'])
        item['updatetime'] = dateFormat( item['updatetime'],'YYYY-MM-DD')
    })
    res.json(result)
    
}

CateController.addCate = function(req,res){
    let userInfo = JSON.parse(req.session.userInfo || '{}');
    res.render('addCate.html',{userInfo})
}

CateController.delete = async (req,res) => {
    let {cat_id} = req.body;
    let sql =  `delete from classification where id = ${cat_id}`;
    try{
        let result = await queryPromise(sql)
        res.json({
            code:20000,
            message:'删除成功'
        })
    }catch(err){
        // 错误上报
        res.json({
            code:-1,
            message:"删除失败"
        })
    }
}

CateController.editCate = (req,res) =>{
    let userInfo = JSON.parse(req.session.userInfo || '{}')
    res.render('editCate.html',{userInfo})
}

CateController.insertCate = function(req,res){
    let {is_show,cate_name,content} = req.body;
    // 1. 判断分类名称是否占用
    let sql = `select * from classification where name = '${cate_name}'`;
    queryPromise(sql).then(result=>{
        if(result.length){
            // 说明被占用
            res.json({
                message:"分类名占用",
                code:-1
            })
        }else{
            //2.可用时,进行入库操作
            let add_date = getNowDate();
            let updatetime = dateFormat();
            let sql = `insert into classification(name,int_show,addtime,updatetime,content)
                        values('${cate_name}','${is_show}','${add_date}','${updatetime}','${content}')`
            queryPromise(sql).then(result => {
                res.json({
                    message:"添加分类成功",
                    code:20000
                })
            })
        }
    })
}

CateController.detail = async function(req,res){
    let {cat_id} = req.query;
    let sql = `select * from classification where id=${cat_id}`;
    try{
    let data = await queryPromise(sql); // [{}]
    res.json(data[0] || {})
    }catch(err){
        res.json({})
    }
}

CateController.updateCate = async(req,res)=>{
    const {cat_id,cate_name,is_show,content} = req.body;
    // 1.判断分类名是否占用(排除自己)
    let sql = `select id from classification where name='${cate_name}' and id!=${cat_id}`;
    let result =  await queryPromise(sql);
    console.log(result)
    if(result.length){
        // 说明被占用
        res.json({
            code:-1,
            message:"分类名被占用"
        })
        return;
    }
    // 2.没占用则更新
    let sql2 = `update classification set name = '${cate_name}',int_show = '${is_show}',content='${content}' where id = ${cat_id}`;
    let result2 = await queryPromise(sql2);
    if(result2.affectedRows){
        res.json({
            message:"更新分类成功",
            code:20000
        })
    }else{
        res.json({
            message:"更新分类失败",
            code:-1
        })
    }
   
}

module.exports = CateController