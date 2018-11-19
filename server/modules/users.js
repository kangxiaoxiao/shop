//数据模块
var mongoose=require("mongoose");
var UserSchema=require("../schemas/users"); //拿到导出的数据集模块
var Users=mongoose.model("Users",UserSchema); //编译生成Movie模型
module.exports=Users;