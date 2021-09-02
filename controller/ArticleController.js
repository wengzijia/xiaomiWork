// 文章控制器
const mysql = require('mysql');
const fs = require('fs')
const path = require('path')

const ArticleController = {}

// 导入模型
const dbQuery = require('../model/query.js');
const dbQueryPromise = require('../model/query-promise.js')

const { getUnixTime } = require('../util/tool.js');
const session = require('express-session');

// 只要是一种映射的数据关系，都可以用对象形式来简化if elseif
let statusTextMap = {
    0: '<span class="c-gray">待审核</span>',
    1: '<span class="c-green">审核通过</span>',
    2: '<span class="c-red">审核失败</span>'
}
// 首页文章列表
// ArticleController.index = (req, res) => {
//     //判断是否有session权限
//     // if(!req.session.userInfo){
//     //     res.redirect('/login');
//     //     return;
//     // }
//     //取出session中的用户信息
//     let userInfo = JSON.parse(req.session.userInfo || '{}');
//     console.log(userInfo);
//     //1.编写sql语句
//     let sql = `select c1.*,c2.name from article_table c1
//                left join classification c2
//                on c1.cat_id = c2.id
//                where c1.is_delete = 0
//                order by c1.id desc `;
//     //2.执行sql
//     dbQuery(sql, (err, rows) => {
//         let data = rows.map((item) => {
//             item.status_text = statusTextMap[item.isverify]
//             return item
//         })
//         //3.把查询出来的数据分配到模板引擎中
//         res.render('article-list.html', { article: data, userInfo })
//     })
// }

ArticleController.index = (req, res) => {
    //判断是否有session权限
    // if(!req.session.userInfo){
    //     res.redirect('/login');
    //     return;
    // }
    //取出session中的用户信息
    let userInfo = JSON.parse(req.session.userInfo || '{}');
    console.log(userInfo);
    //1.编写sql语句
    let sql = `select c1.*,c2.name from article_table c1
               left join classification c2
               on c1.cat_id = c2.id
               where c1.is_delete = 0
               order by c1.id desc `;
    //2.执行sql
    dbQueryPromise(sql).then(rows => {
        let data = rows.map((item) => {
            item.status_text = statusTextMap[item.isverify]
            return item
        })
        //3.把查询出来的数据分配到模板引擎中
        res.render('article-list.html', { article: data, userInfo })
    })
}

// 回收站列表
// ArticleController.recyclelist = (req, res) => {
//     //1.编写sql语句
//     let sql = `select c1.*,c2.name from article_table c1
//                left join classification c2
//                on c1.cat_id = c2.id
//                where c1.is_delete = 1
//                order by c1.id desc `;
//     //2.执行sql
//     dbQuery(sql, (err, rows) => {
//         let data = rows.map((item) => {
//             item.status_text = statusTextMap[item.isverify]
//             return item
//         })
//         //3.把查询出来的数据分配到模板引擎中
//         res.render('recycle.html', { article: data })
//     })
// }

ArticleController.recyclelist = (req, res) => {
    //1.编写sql语句
    let sql = `select c1.*,c2.name from article_table c1
               left join classification c2
               on c1.cat_id = c2.id
               where c1.is_delete = 1
               order by c1.id desc `;
    //2.执行sql
    dbQueryPromise(sql).then(rows => {
        let data = rows.map((item) => {
            item.status_text = statusTextMap[item.isverify]
            return item
        })
        //3.把查询出来的数据分配到模板引擎中
        res.render('recycle.html', { article: data })
    })
}

// 永久删除
// ArticleController.delete = (req, res) => {
//     let { id, img } = req.query;
//     let sql = `delete from  article_table where id=${id}`
//     dbQuery(sql, (err, result) => {
//         if (result.affectedRows) {
//             //删除文章的引用图片
//             if (img) {
//                 let oldpath = path.join(__dirname, '../', img)
//                 fs.unlink(oldpath, (err) => {
//                     console.log('删除成功')
//                 })
//             }
//             res.redirect('/')
//         } else {
//             res.send('<script>alert("删除失败");location.href=' / ';</script>')
//         }
//     })
// }

ArticleController.delete = (req, res) => {
    let { id, img } = req.query;
    let sql = `delete from  article_table where id=${id}`
    dbQueryPromise(sql).then(result => {
        if (result.affectedRows) {
            //删除文章的引用图片
            if (img) {
                let oldpath = path.join(__dirname, '../', img)
                fs.unlink(oldpath, (err) => {
                    console.log('删除成功')
                })
            }
            res.redirect('/')
        } else {
            res.send('<script>alert("删除失败");location.href=' / ';</script>')
        }
    })
}


// ajax永久删除
// ArticleController.ajaxdelete = (req, res) => {
//     let { id, img } = req.body;
//     let sql = `delete from  article_table where id=${id}`
//     dbQuery(sql, (err, result) => {
//         if (result.affectedRows) {
//             //删除文章的引用图片
//             if (img) {
//                 let oldpath = path.join(__dirname, '../', img)
//                 fs.unlink(oldpath, (err) => {
//                     console.log('删除成功')
//                 })
//             }
//             res.json({
//                 code:20000,
//                 message:"succes"
//             })
//         } else {
//             res.json({
//                 code:-1,
//                 message:"fail"
//             })
//         }
//     })
// }

ArticleController.ajaxdelete = (req, res) => {
    let { id, img } = req.body;
    let sql = `delete from  article_table where id=${id}`
    dbQueryPromise(sql).then(result => {
        if (result.affectedRows) {
            //删除文章的引用图片
            if (img) {
                let oldpath = path.join(__dirname, '../', img)
                fs.unlink(oldpath, (err) => {
                    console.log('删除成功')
                })
            }
            res.json({
                code: 20000,
                message: "succes"
            })
        } else {
            res.json({
                code: -1,
                message: "fail"
            })
        }
    })
}

//展示一个添加文章的表单页面
// ArticleController.add = (req, res) => {
//     let userInfo = JSON.parse( req.session.userInfo || '{}' );
//     let sql = `select * from classification`;
//     dbQuery(sql, (err, rows) => {
//         res.render('add.html', { cats: rows,userInfo })
//     })
// }

ArticleController.add = (req, res) => {
    let userInfo = JSON.parse(req.session.userInfo || '{}');
    let sql = `select * from classification`;
    dbQueryPromise(sql).then(rows => {
        res.render('addArticle.html', { cats: rows, userInfo })
    })
}

//实现数据添加入库
// ArticleController.insert = (req, res) => {
//     console.log('req.file:', req.file)
//     //判断是否有图片
//     let imgPath = '';
//     if (req.file) {
//         let { originalname, filename } = req.file
//         let ext = originalname.substring(originalname.indexOf('.')); // .png
//         //把上传成功后的文件进行重命名
//         let oldPath = path.join(__dirname, '../', 'uploads', filename);
//         let newPath = path.join(__dirname, '../', 'uploads', filename) + ext;
//         //数据库记录存放的路径 
//         imgPath = `uploads/${filename}${ext}`
//         fs.renameSync(oldPath, newPath)
//     }
//     // 1.接受post参数
//     let { title, author, cat_id, content, status } = req.body;
//     let nowTime = getUnixTime();

//     // 2.编写sql语句插入到文章表中
//     let sql = `insert into article_table(title,author,cat_id,content,img,isverify,updatetime)
//                 values('${title}','${author}','${cat_id}','${content}','${imgPath}','${status}',${nowTime})`;
//     dbQuery(sql, (err, result) => {
//         if (result.affectedRows) {
//             res.send("<script>alert('成功');location.href='/article';</script>")
//         } else {
//             res.send('<script>alert("失败");location.href="/add";</script>')
//         }
//     })
// }

ArticleController.insert = (req, res) => {
    console.log('req.file:', req.file)
    //判断是否有图片
    let imgPath = '';
    if (req.file) {
        let { originalname, filename } = req.file
        let ext = originalname.substring(originalname.indexOf('.')); // .png
        //把上传成功后的文件进行重命名
        let oldPath = path.join(__dirname, '../', 'uploads', filename);
        let newPath = path.join(__dirname, '../', 'uploads', filename) + ext;
        //数据库记录存放的路径 
        imgPath = `uploads/${filename}${ext}`
        fs.renameSync(oldPath, newPath)
    }
    // 1.接受post参数
    let { title, author, cat_id, content, status } = req.body;
    let nowTime = getUnixTime();

    // 2.编写sql语句插入到文章表中
    let sql = `insert into article_table(title,author,cat_id,content,img,isverify,updatetime)
                values('${title}','${author}','${cat_id}','${content}','${imgPath}','${status}',${nowTime})`;
    dbQueryPromise(sql).then(result => {
        if (result.affectedRows) {
            res.send("<script>alert('成功');location.href='/article';</script>")
        } else {
            res.send('<script>alert("失败");location.href="/add";</script>')
        }
    })
}


//实现编辑文章页面的回显操作
// ArticleController.edit = (req, res) => {
//     //1.接受参数id
//     let { id } = req.query;
//     //2.编写sql语句查询当前文章的数据分配给模板
//     let sql1 = `select * from article_table where id=${id}`;
//     dbQuery(sql1, (err, rows1) => {
//         let sql2 = "select * from classification"
//         dbQuery(sql2, (err, row2) => {
//             // 因为查询数据库是异步操作，要等到所有的异步操作成功之后才可以渲染render模板页面
//             res.render('edit.html', {
//                 article: rows1[0],
//                 cats: row2
//             })
//         })

//     })
// }

ArticleController.edit = (req, res) => {
    //1.接受参数id
    let { id } = req.query;
    //2.编写sql语句查询当前文章的数据分配给模板
    let sql1 = `select * from article_table where id=${id}`;
    let article = '';
    let cats = '';
    dbQueryPromise(sql1).then(rows1 => {
        article = rows1[0]
        let sql2 = "select * from classification"
        return dbQueryPromise(sql2)
    }).then((row2 => {
        cats = row2
        // 因为查询数据库是异步操作，要等到所有的异步操作成功之后才可以渲染render模板页面
        res.render('edit.html', {
            article,cats
        })
    }
    ))

}


// 实现文章更新入库操作
// ArticleController.update = (req, res) => {
//     let { id, title, author, status, cat_id, content, oldImg } = req.body


//     let update_time = getUnixTime();
//     let imgPath;
//     if (req.file) {
//         let { originalname, filename } = req.file
//         let ext = originalname.substring(originalname.indexOf('.')); // .png
//         //把上传成功后的文件进行重命名
//         let oldPath = path.join(__dirname, '../', 'uploads', filename);
//         let newPath = path.join(__dirname, '../', 'uploads', filename) + ext;
//         //数据库记录存放的路径 
//         imgPath = `uploads/${filename}${ext}`
//         fs.renameSync(oldPath, newPath)
//     } else {
//         //用户没有上传图片，则保留原图
//         imgPath = oldImg
//     }

//     let sql = `update article_table set
//                title = '${title}',img = '${imgPath}',author= '${author}',
//                isverify= '${status}',cat_id= ${cat_id},content = '${content}',updatetime = '${update_time}' where id = ${id}`;
//     dbQuery(sql, (err, result) => {
//         if (result.affectedRows) {
//             // 上传新图把原图删除掉
//             if (req.file) {
//                 let oldPath = path.join(__dirname, '../', oldImg)
//                 fs.unlink(oldPath, (err) => {

//                 })
//             }
//             res.redirect('/article')
//         } else {
//             res.send('<script>alert("编辑失败");location.href="/";</script>')
//         }
//     })

// }

ArticleController.update = (req, res) => {
    let { id, title, author, status, cat_id, content, oldImg } = req.body


    let update_time = getUnixTime();
    let imgPath;
    if (req.file) {
        let { originalname, filename } = req.file
        let ext = originalname.substring(originalname.indexOf('.')); // .png
        //把上传成功后的文件进行重命名
        let oldPath = path.join(__dirname, '../', 'uploads', filename);
        let newPath = path.join(__dirname, '../', 'uploads', filename) + ext;
        //数据库记录存放的路径 
        imgPath = `uploads/${filename}${ext}`
        fs.renameSync(oldPath, newPath)
    } else {
        //用户没有上传图片，则保留原图
        imgPath = oldImg
    }

    let sql = `update article_table set
               title = '${title}',img = '${imgPath}',author= '${author}',
               isverify= '${status}',cat_id= ${cat_id},content = '${content}',updatetime = '${update_time}' where id = ${id}`;
    dbQueryPromise(sql).then(result => {
        if (result.affectedRows) {
            // 上传新图把原图删除掉
            if (req.file) {
                let oldPath = path.join(__dirname, '../', oldImg)
                fs.unlink(oldPath, (err) => {

                })
            }
            res.redirect('/article')
        } else {
            res.send('<script>alert("编辑失败");location.href="/";</script>')
        }
    })

}


//实现文章加入回收站
// ArticleController.recycle = (req, res) => {
//     let { id = 0 } = req.query;
//     $sql = `update article_table set is_delete = 1 where id = ${id}`;
//     dbQuery($sql, (err, result) => {
//         let { affectedRows } = result;
//         if (affectedRows) {
//             res.redirect('/recyclelist')
//         } else {
//             res.send("<script>alert('加入失败');location.href='/';</script>")
//         }
//     })
// }

ArticleController.recycle = (req, res) => {
    let { id = 0 } = req.query;
    $sql = `update article_table set is_delete = 1 where id = ${id}`;
    dbQueryPromise($sql).then(result=> {
        let { affectedRows } = result;
        if (affectedRows) {
            res.redirect('/recyclelist')
        } else {
            res.send("<script>alert('加入失败');location.href='/';</script>")
        }
    })
}

//实现文章还原
// ArticleController.restore = (req, res) => {
//     let { id = 0 } = req.query;
//     $sql = `update article_table set is_delete = 0 where id = ${id}`;
//     dbQuery($sql, (err, result) => {
//         let { affectedRows } = result;
//         if (affectedRows) {
//             res.redirect('/')
//         } else {
//             res.send("<script>alert('还原失败');location.href='/';</script>")
//         }
//     })
// }

ArticleController.restore = (req, res) => {
    let { id = 0 } = req.query;
    $sql = `update article_table set is_delete = 0 where id = ${id}`;
    dbQueryPromise($sql).then(result => {
        let { affectedRows } = result;
        if (affectedRows) {
            res.redirect('/')
        } else {
            res.send("<script>alert('还原失败');location.href='/';</script>")
        }
    })
}

//展示一个上传文件的表单
ArticleController.addImg = (req, res) => {
    res.render('addimg.html')
}


// 处理文件上传
ArticleController.upload = (req, res) => {
    console.log(req.file) // 接受二进制数据
    let { originalname, filename, destination } = req.file
    let ext = originalname.substring(originalname.indexOf('.')); // .png
    //把上传成功后的文件进行重命名
    let oldPath = path.join(__dirname, '../', 'uploads', filename);
    let newPath = path.join(__dirname, '../', 'uploads', filename) + ext;
    fs.renameSync(oldPath, newPath)
    console.log(req.body) // 普通文本数据
    res.send('upload sucess')
}

// 文章详情查看
// ArticleController.detail = (req, res) => {
//     let { id } = req.query;
//     let sql = `select c1.*,c2.name from article_table c1  left join  classification  c2 on c1.cat_id = c2.id where c1.id = ${id}`;
//     dbQuery(sql, (err, rows) => {
//         //渲染一个模板
//         res.render('detail.html', { article: rows[0] })
//     })
// }


ArticleController.detail = (req, res) => {
    let { id } = req.query;
    let sql = `select c1.*,c2.name from article_table c1  left join  classification  c2 on c1.cat_id = c2.id where c1.id = ${id}`;
    dbQueryPromise(sql).then(rows => {
        //渲染一个模板
        res.render('detail.html', { article: rows[0] })
    })
}


ArticleController.editContent = (req,res)=>{
    let userInfo = JSON.parse(req.session.userInfo || '{}')
    res.render('editContent.html',{userInfo})
}

ArticleController.updateArtilceContent = async (req,res) => {
    let {id,content} = req.body;
    let sql = `update article_table set content = '${content}' where id = ${id}`;
    let result = await dbQueryPromise(sql);
    res.json({
        code:20000,
        message:"编辑文章成功"
    })
}

module.exports = ArticleController