var express = require('express');
var mongoose=require("mongoose"); //kxx导入mongoose模块
var Users=require("../modules/users");  //导入模型数据模块
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get("/users",function(req,res,next){
  Users.fetch(function(err,users){
    if(err){
      console.log(err);
        res.json({
            status:"1",
            msg:err.message
        })
    }
    res.json({
        status:"0",
        users:users
    })
  })
})
module.exports = router;
