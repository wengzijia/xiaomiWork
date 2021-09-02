const express = require('express');
const path = require('path');
const moment = require('moment');
const open = require('open');
const PORT = 8880;
const notFound = require('./notFoundmiddleware');
const app = express();
const request_log = require('./middleware/requestLog.js')
app.use(express.static(path.join(__dirname,"public")));
// 导入模板引擎
const artTemplate = require('art-template'); 
const express_template = require('express-art-template');

// 配置模板引擎
app.set('views', __dirname + '/views/'); // 配置模板的路径
app.engine('html', express_template);  // 设置模板后缀为.html的文件(不设这句话，模板文件的后缀默认是.art)
app.set('view engine', 'html'); // 设置视图引擎为上面的html

// app.use(request_log)

app.get('/',(req,res)=>{
    let topbarNav = [
        '小米商城','MIUI','loT','云服务','天星数科','有品',
        '小爱开放平台','企业团购','资质证照','协议规则','下载app',
        '智能生活','Select Location'
    ];
    let topbarInfo = ['登录','注册','消息通知'];
    let topbarCart = ['购物车 （0）'];
    let headerNav = [
        {name:'小米手机'},
        {name:'Redmi红米'},
        {name:'电视'},
        {name:'笔记本'},
        {name:'家电'},
        {name:'路由器'},
        {name:'智能硬件'},
        {name:'服务'},
        {name:'社区'}
    ];
    let siteCategory = [
        '手机 电话卡','电视 盒子','笔记本 显示器',
        '家电 插线板','出行 穿戴','智能 路由器','电源 配件',
        '健康 儿童','耳机 音箱','生活 箱包'
    ];
    let iconContent = [
        {iconfont:"iconfont icon-shijian",name:"小米秒杀"},
        {iconfont:"iconfont icon-qiye",name:"企业团购"},
        {iconfont:"iconfont icon-Fnum",name:"F码通道"},
        {iconfont:"iconfont icon-mifenqia-copy",name:"米粉卡"},
        {iconfont:"iconfont icon-yijiuhuanxin",name:"以旧换新"},
        {iconfont:"iconfont icon-huafeichongzhi",name:"话费充值"}
    ]
    let seckill  = [
        {
            picture:"/images/米家飞行员太阳镜 Pro.webp",
            title:"米家飞行员太阳镜 Pro 椭圆框 渐变灰",
            smalltitle:"尼龙偏光，轻巧佩戴",
            newPrice:"179元",
            oldPrice:"199元"
        },
        {
            picture:"/images/9号平衡车.jpg",
            title:"九号平衡车 白色",
            smalltitle:"年轻人的酷玩具",
            newPrice:"1849元",
            oldPrice:"1999元"
        },
        {
            picture:"/images/积木.webp",
            title:"木星黎明系列积木 静态积木 天鹰座侦察机 灰色",
            smalltitle:"大扭矩电机，真彩灯模块",
            newPrice:"179元",
            oldPrice:"199元"
        },
        {
            picture:"/images/麦克风.webp",
            title:"纯麦无线K歌麦克风 U7PRO",
            smalltitle:"小米电视专属定制，全场景麦克风",
            newPrice:"349元",
            oldPrice:"399元"
        }
    ]
    let  phone = [
        {
            picture:"/images/MIX.webp",
            title:"小米MIX FOLD",
            smalltitle:"折叠大屏｜自研芯片",
            Price:" 9999元起"
        },
        {
            picture:"/images/小米11.webp",
            title:"小米11 Ultra",
            smalltitle:"1.12''GN2｜2K四微曲屏",
            Price:"5999元起"
        },
        {
            picture:"/images/小米11pro.webp",
            title:"小米11 Pro",
            smalltitle:"永远滴神",
            Price:" 9999元起"
        },
        {
            picture:"/images/小米11青春版.webp",
            title:"小米11 青春版",
            smalltitle:"小米11 青春版 轻薄",
            Price:"2299元起"
        },
        {
            picture:"/images/K40游戏增强版.webp",
            title:"K40 游戏增强版",
            smalltitle:"轻薄电竞设计",
            Price:" 1999元起"
        },
        {
            picture:"/images/黑鲨4pro.webp",
            title:"黑鲨4 Pro",
            smalltitle:"黑鲨4 Pro",
            Price:"3999元起"
        },
        {
            picture:"/images/黑鲨4.webp",
            title:"黑鲨4",
            smalltitle:"黑鲨4 磁动力升降肩键",
            Price:" 2499元起"
        },
        {
            picture:"/images/小米10s.webp",
            title:"小米10S",
            smalltitle:"骁龙870 | 对称式双扬立体声",
            Price:"3299元起"
        }
    ]
    let appliance = [
        {
            picture:"/images/E43K.webp",
            title:"全面屏电视E43K",
            smalltitle:"全面屏设计，海量内容",
            Price:" 1349元起"
        },
        {
            picture:"/images/55英寸.webp",
            title:"全面屏电视 55英寸E55X",
            smalltitle:"潮流全面屏设计",
            Price:"2299元起"
        },
        {
            picture:"/images/4A.webp",
            title:"小米电视4A 60英寸",
            smalltitle:"人工智能语音系统,超高清画质",
            Price:" 4499元起"
        },
        {
            picture:"/images/75英寸.jpg",
            title:"小米电视4S 75英寸",
            smalltitle:"4K HDR，人工智能语音",
            Price:"2299元起"
        },
        {
            picture:"/images/65英寸.webp",
            title:"小米全面屏电视65英寸 E65X",
            smalltitle:"全面屏设计",
            Price:" 2999元起"
        },
        {
            picture:"/images/E32c.webp",
            title:"小米全面屏电视E32C",
            smalltitle:"全面屏设计，人工智能系统",
            Price:"949元起"
        },
        {
            picture:"/images/A55.webp",
            title:"Redmi智能电视A55",
            smalltitle:"澎湃音效影院级体验",
            Price:"2088元起"
        }
    ]
    let ability = [
        {
            picture:"/images/小米音响play.webp",
            title:"小米小爱音箱 Play",
            smalltitle:"听音乐、语音遥控家电",
            Price:"109元起"
        },
        {
            picture:"/images/米家智能窗帘.webp",
            title:"米家智能窗帘",
            smalltitle:"窗帘开合随心控",
            Price:"799元起"
        },
        {
            picture:"/images/小米体脂称2.webp",
            title:"小米体脂秤2",
            smalltitle:"轻松掌握身体脂肪率",
            Price:"99元起"
        },
        {
            picture:"/images/9号平衡车.jpg",
            title:"九号平衡车",
            smalltitle:"年轻人的酷玩具",
            Price:"1849元起"
        },
        {
            picture:"/images/小米智能门锁 推拉式.webp",
            title:"小米智能门锁 推拉式",
            smalltitle:"一步推拉，高端智能门锁",
            Price:"1599元起"
        },
        {
            picture:"/images/Redmi小爱触屏音箱 8英寸.webp",
            title:"Redmi小爱触屏音箱 8英寸",
            smalltitle:"超大屏，让智能更多可能",
            Price:"349元起"
        },
        {
            picture:"/images/小米手环5.webp",
            title:"小米手环5",
            smalltitle:"11种运动模式 磁吸式充电",
            Price:"179元起"
        }
    ]
    let match = [
        {
            picture:"/images/小米真无线蓝牙耳机Air 2 Pro.webp",
            title:"小米真无线蓝牙耳机Air 2 Pro",
            smalltitle:"主动降噪/持久续航/无线充",
            Price:" 699元起"
        },
        {
            picture:"/images/高速无线充套装.webp",
            title:"高速无线充套装",
            smalltitle:"快速无线闪充，Qi充电标准",
            Price:"149元起"
        },
        {
            picture:"/images/Redmi AirDots 2真无线蓝牙耳机.webp",
            title:"Redmi AirDots 2真无线蓝牙耳机",
            smalltitle:"支持蓝牙5.0，自动秒连，拿起就能用",
            Price:"99元起"
        },
        {
            picture:"/images/小米真无线蓝牙耳机Air 2s.webp",
            title:"小米真无线蓝牙耳机Air 2s",
            smalltitle:"全面升级，智慧真无线",
            Price:"399元起"
        },
        {
            picture:"/images/Redmi充电宝 10000mAh 标准版 白色.webp",
            title:"Redmi充电宝 10000mAh 标准版 白色",
            smalltitle:"10000mAh大电量",
            Price:" 59元起"
        },
        {
            picture:"/images/Redmi充电宝 20000mAh 快充版.webp",
            title:"Redmi充电宝 20000mAh 快充版",
            smalltitle:"大容量， 可上飞机",
            Price:"99元起"
        },
        {
            picture:"/images/小米插线板 5孔位.jpg",
            title:"小米插线板 5孔位",
            smalltitle:"多重安全保护",
            Price:"39元起"
        }
    ]
    let ACC = [
        {
            picture:"/images/小米氮化镓GaN充电器 Type-C 65W.webp",
            title:"小米氮化镓GaN充电器 Type-C 65W",
            smalltitle:"氮化镓黑科技 65W MAX 大功率快充",
            Price:" 149元起"
        },
        {
            picture:"/images/高速无线充套装.webp",
            title:"高速无线充套装",
            smalltitle:"快速无线闪充，Qi充电标准",
            Price:"149元起"
        },
        {
            picture:"/images/小米无线充电宝青春版10000mAh.webp",
            title:"小米无线充电宝青春版10000mAh",
            smalltitle:"能量满满，无线有线都能充",
            Price:"129元起"
        },
        {
            picture:"/images/小米车载充电器快充版.webp",
            title:"小米车载充电器快充版",
            smalltitle:"双口快充，安全稳定",
            Price:"69元起"
        },
        {
            picture:"/images/小米Type-C转Lightning数据线 1m.webp",
            title:"小米Type-C转Lightning数据线 1m",
            smalltitle:"苹果MFi官方认证，支持快充 ",
            Price:"59元起"
        },
        {
            picture:"/images/小米车载充电器快充版1A1C 100W.webp",
            title:"小米车载充电器快充版1A1C 100W",
            smalltitle:"小米车载充电器快充版1A1C 100W",
            Price:"99元起"
        },
        {
            picture:"/images/小米氮化镓GaN充电器 Type-C 65W 2.webp",
            title:"小米氮化镓GaN充电器 Type-C 65W",
            smalltitle:"氮化镓黑科技 65W MAX 大功率快充",
            Price:"149元起"
        }
    ]
    let periphery = [
        {
            picture:"/images/米家飞行员太阳镜 Pro.webp",
            title:"米家飞行员太阳镜 Pro",
            smalltitle:"尼龙偏光，轻巧佩戴",
            Price:"179元"
        },
        {
            picture:"/images/小米巨能写中性笔10支装.webp",
            title:"小米巨能写中性笔10支装",
            smalltitle:"一支顶4支，超长顺滑书写",
            Price:"9.99元"
        },
        {
            picture:"/images/米家迷你保温杯.webp",
            title:"米家迷你保温杯",
            smalltitle:"可以随身携带的温度",
            Price:"49元"
        },
        {
            picture:"/images/贝医生巴氏牙刷 四色装.jpg",
            title:"贝医生巴氏牙刷 四色装",
            smalltitle:"进口刷毛，好品质",
            Price:"39.9元"
        },
        {
            picture:"/images/米家运动鞋4.webp",
            title:"米家运动鞋4",
            smalltitle:"轻盈若絮,弹若脱兔",
            Price:"169元"
        },
        {
            picture:"/images/米家指甲刀五件套.webp",
            title:"米家指甲刀五件套",
            smalltitle:"轻巧多用，优雅随行",
            Price:"39.9元"
        },
        {
            picture:"/images/8H乳胶床垫2.webp",
            title:"8H乳胶床垫2",
            smalltitle:"软硬双面可睡",
            Price:"499元起"
        }
    ]
    let video = [
        {
            picture:"/images/2021年春季新品发布会第一场.webp",
            title:"2021年春季新品发布会第一场"
        },
        {
            picture:"/images/Redmi 10X系列发布会.webp",
            title:"Redmi 10X系列发布会"
        },
        {
            picture:"/images/小米10 青春版 发布会.webp",
            title:"小米10 青春版 发布会",
        },
        {
            picture:"/images/小米10 8K手机拍大片.webp",
            title:"小米10 8K手机拍大片"
        }
    ]
    let service = [
        {iconfont:"iconfont icon-weixiu",service:"预约维修服务"},
        {iconfont:"iconfont  icon-tian",service:"7天无理由退货"},
        {iconfont:"iconfont  icon-15",service:"15天免费换货"},
        {iconfont:"iconfont icon-liwu",service:"满69包邮"},
        {iconfont:"iconfont icon-Frame1",service:"520余家售后网点"},
    ]
    let ReferenceServices = [
        {title:"帮助中心",name:"账户管理",names:"购物指南",namess:"订单操作"},
        {title:"服务支持",name:"售后政策",names:"自助服务",namess:"相关下载"},
        {title:"线下门店",name:"小米之家",names:"服务网点",namess:"授权体验店"},
        {title:"关于小米",name:"了解小米",names:"加入小米",namess:"投资者关系"},
        {title:"关注我们",name:"新浪微博",names:"官方微信",namess:"联系我们"},
        {title:"特色服务",name:"F码通道",names:"礼物码",namess:"防伪查询"}
    ]
    let feature = [
        "小米商城","MIUI","米家","米聊","多看","游戏","政企服务","小米天猫店",
        "小米集团隐私政策","小米公司儿童信息保护规则","小米商城隐私政策","小米商城用户协议","问题反馈"
    ]
    let feature1 = ["北京互联网法院法律服务工作站","中国消费者协会"];
    let feature2 = ["京ICP备10046444号","京公网安备11010802020134号","京网文[2020]0276-042号"];
    let feature3 = [
        "（京）网械平台备字（2018）第00005号","互联网药品信息服务资格证 (京)-非经营性-2014-0090",
        "营业执照","医疗器械质量公告"
    ]
    let infopicture = [
        "/images/truste.png","/images/信.png","/images/信2.png",
        "/images/诚信经营.png","/images/网站安全.png"
    ]
    let fixed = [
        {iconfont:"iconfont icon-shoujiAPP",name:"手机APP"},
        {iconfont:"iconfont icon-gerenzhongxinxiaotubiao-",name:"个人中心"},
        {iconfont:"iconfont iconfont icon-weixiu",name:"售后服务"},
        {iconfont:"iconfont icon-shouhoufuwu",name:"人工客服"},
        {iconfont:"iconfont icon-gouwuche",name:"购物车"}
    ]
    res.render('index.html',{
        topbarNav,topbarInfo,topbarCart,headerNav,siteCategory,iconContent,seckill,phone,appliance,
        ability,match,ACC,periphery,video,service,ReferenceServices,feature,feature1,feature2,feature3,
        infopicture,fixed
    })
})


app.use(notFound)
app.listen(PORT,()=>{
    open(`http://127.0.0.1:${PORT}`)
    console.log(`server is running at port 8800`)
}) 