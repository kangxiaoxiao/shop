var mongoose = require('mongoose');
var MovieSchema = new mongoose.Schema({
    name:String,
    age:Number,
    sex:String,
    nativePlace:String,
    location:String,
    lines:String,
    cover:String,
    imgs:Array,
});
module.exports =MovieSchema;