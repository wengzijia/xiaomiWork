let md5 = require('md5');
let CryptoJS = require('crypto-js');


//md5是属于单向加密，只能加密不能解密
let secret = "￥%%￥%#&……#%￥%%"; // 随机字符串(盐salt)
console.log(md5(`123456${secret}`))
console.log(CryptoJS.MD5(`2345678${secret}`).toString())