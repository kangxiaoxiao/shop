var express = require('express');
var mongoose=require("mongoose"); //kxx导入mongoose模块
var Heros=require("../modules/heros");  //导入模型数据模块
var router = express.Router();
var fs=require("fs");

var multer  = require('multer'); //文件上传的中间件
var upload = multer({ dest: 'uploads/' }); //文件存储的位置

/* GET users listing. */
router.get("/",function(req,res,next){
    //res.send("i'm hero page");
    Heros.find({},function(err,docs){
        if(err){
            res.json({
               status:"1",
                msg:err.message
            })
        }
        res.json({
            status:"0",
            heros:docs,
        })
    });
});

router.get("/heroDetail",function(req,res,next){
    console.log("英雄详情请求的参数",req.query._id);
   let  params={
      "_id":  req.query._id
    }
    Heros.find(params,function(err,docs){
        if(err){
            res.json({
                status:"1",
                msg:err.message
            })
        }
        res.json({
            status:"0",
           // hero:{...docs}[0]
            hero:docs
        })
    })
});
router.post("/addHero",function(req,res){
    let params= req.body||{};
    Heros.findOne({name:params.name},(err,doc)=>{
       if(err){
           res.json({
               status:"1",
               msg:err.message
           })
       }else{
           let msg="";
           for(let key in params){
               if(!params[key]){
                   switch(key){
                       case "name":
                           msg="姓名";
                           break;
                       case "age":
                           msg="年龄";
                           break;
                       case "sex":
                           msg="性别";
                           break;
                       case "nativePlace":
                           msg="籍贯";
                           break;
                       case "location":
                           msg="位置";
                           break;
                       case "lines":
                           msg="台词";
                           break;
                   }
                   break;
               }
           }
           if(msg){
               res.json({
                   status:"1",
                   msg:msg+"不能为空",
                   result:""
               })
           }else{
               if(!doc){
                   Heros.create(params,(err,doc)=>{
                       if(err){
                           res.json({
                               status:"1",
                               msg:err.message
                           })
                       }else{
                           res.json({
                               status:"0",
                               msg:"",
                               result:doc
                           })
                       }
                   })
               }else{
                   res.json({
                       status:"1",
                       msg:"用户名已存在",
                       result:""
                   })
               }
           }


       }
    })

});
router.post("/editHero",function(req,res){
    let params= req.body||{};
    Heros.findOne({_id:params._id},(err,doc)=>{
        if(err){
            res.json({
                status:"1",
                msg:err.message
            })
        }else{
            let msg="";
            for(let key in params){
                if(!params[key]){
                    switch(key){
                        case "name":
                            msg="姓名";
                            break;
                        case "age":
                            msg="年龄";
                            break;
                        case "sex":
                            msg="性别";
                            break;
                        case "nativePlace":
                            msg="籍贯";
                            break;
                        case "location":
                            msg="位置";
                            break;
                        case "lines":
                            msg="台词";
                            break;
                    }
                    break;
                }
            }
            if(msg){
                res.json({
                    status:"1",
                    msg:msg+"不能为空",
                    result:""
                })
            }else{
                if(doc){
                    Object.assign(doc,params);
                    doc.save((err1,doc1)=>{
                        if(err1){
                            res.json({
                                status:"1",
                                msg:err1.message
                            })
                        }else{
                            res.json({
                                status:"0",
                                msg:"",
                                result:doc1
                            })
                        }
                    })
                }
            }


        }
    })
});
router.post("/deleteHero",function(req,res){
    let params= req.body||{};
    Heros.findOne({_id:params.id},(err,doc)=>{
        if(err){
            res.json({
                status:"1",
                msg:err.message
            })
        }else{
            if(doc){
                doc.remove((err1,doc1)=>{
                    if(err1){
                        res.json({
                            status:"1",
                            msg:err1.message
                        })
                    }else{
                        res.json({
                            status:"0",
                            msg:"",
                            result:doc1
                        })
                    }
                })
            }
        }
    })
});
/*
  文件上传
  .single(fieldname)
  接受一个以 fieldname 命名的文件。这个文件的信息保存在 req.file
*/
router.post('/single_uploadImg', upload.single('avatar'), function (req, res) {
    //test和前端form一致:formData.append('test',$('.photo')[0].files[0]);
    var heroId=req.body.id;
    var filename=new Date().getTime()+
        parseInt(Math.random()*9999)+'.'+req.file.originalname;//图片名(避免重复)
    var des_file='./public/images/'+filename;//写入路径
    //console.log(des_file);
    var dir='images/'+filename;//读取文件路径
    //console.log(dir);
    fs.readFile(req.file.path,(err,data)=>{//读取上传文件
        //console.log(data);
        fs.writeFile(des_file,data,(err,datas)=>{
            if(err){
                //console.log(err)
                return res.json({err:-2,msg:"上传错误"})
            }
            Heros.findOne({_id:heroId},(err1,doc1)=>{
                if(err1){
                    res.json({
                        status:"1",
                        msg:err.message
                    })
                }else{
                    if(doc1){
                      doc1.cover=dir;
                        doc1.save((err1,doc1)=>{
                            if(err1){
                                res.json({
                                    status:"1",
                                    msg:err1.message
                                })
                            }else{
                                res.json({
                                    status:"0",
                                    msg:"",
                                    result:doc1
                                });
                                fs.unlinkSync(req.file.path,(err)=>{//删除临时文件中照片
                                    if (err) {
                                        return res.json({err:-4,msg:"删除缓存失败"})
                                    }
                                });
                            }
                        })
                    }
                }
            })
        })
    })
});
router.post('/multiple_uploadImg', upload.array('photos', 9), function (req, res) {
    var heroId=req.body.id;
    Heros.findOne({_id:heroId},(heroErr,heroDoc)=>{
        if(heroErr){
            res.json({
                status:"1",
                msg:err.message
            })
        }else{
            if(heroDoc){
                let saveImg=new Promise((resolve,reject)=>{
                    let imgArr=[];
                    req.files.forEach(function(cur,index,arr){
                        var filename=new Date().getTime()+
                            parseInt(Math.random()*9999)+'.'+cur.originalname;//图片名(避免重复)
                        var des_file='./public/images/'+filename;//写入路径
                        //console.log(des_file);
                        var dir='images/'+filename;//读取文件路径
                        //console.log(dir);
                        fs.readFile(cur.path,(err,data)=>{//读取上传文件
                            //console.log(data);
                            fs.writeFile(des_file,data,(err,datas)=>{
                                if(err){
                                    //console.log(err)
                                   // return res.json({err:-2,msg:"上传错误"})
                                    reject("上传错误");
                                }
                                imgArr.push(dir);
                                fs.unlinkSync(cur.path,(err)=>{//删除临时文件中照片
                                    if (err) {
                                        // return res.json({err:-4,msg:"删除缓存失败"})
                                        reject("删除缓存失败")
                                    }
                                });
                                if(index==(arr.length-1)){
                                    resolve(imgArr)
                                }
                            })
                        })
                    });
                })
                saveImg.then(data=>{
                    heroDoc.imgs=data;
                    heroDoc.save((err1,doc1)=>{
                        if(err1){
                            res.json({
                                status:"1",
                                msg:err1.message
                            })
                        }else{
                            res.json({
                                status:"0",
                                msg:"",
                                result:doc1
                            });
                        }
                    })
                }).catch(err=>{
                    res.json({
                        status:"1",
                        msg:err
                    })
                })
            }
        }
    })
});
router.post('/uploadImg', upload.array('photos', 9), function (req, res) {
    let saveImg=new Promise((resolve,reject)=>{
        let imgArr=[];
        req.files.forEach(function(cur,index,arr){
            var filename=new Date().getTime()+
                parseInt(Math.random()*9999)+'.'+cur.originalname;//图片名(避免重复)
            var des_file='./public/images/'+filename;//写入路径
            var dir='images/'+filename;//读取文件路径
            fs.readFile(cur.path,(err,data)=>{//读取上传文件
                fs.writeFile(des_file,data,(err,datas)=>{
                    if(err){
                        reject("上传错误");
                    }
                    imgArr.push(dir);
                    fs.unlinkSync(cur.path,(err)=>{//删除临时文件中照片
                        if (err) {
                            reject("删除缓存失败")
                        }
                    });
                    if(index==(arr.length-1)){
                        resolve(imgArr);
                    }
                })
            })
        });
    })
    saveImg.then(response=>{
        res.json({
            status:"0",
            msg:"",
            result:response
        })
    }).catch(err=>{
        res.json({
            status:"1",
            msg:err||'上传失败'
        })
    })
});
module.exports = router;