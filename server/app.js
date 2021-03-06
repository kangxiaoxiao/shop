var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var herosRouter = require('./routes/heros');

var mongoose=require("mongoose"); //kxx导入mongoose模块
//kxx 连接数据库

/*var env=process.env.NODE_ENV || "development";
var dbUrl="mongodb://localhost/shop_kxx"; //线上的mongodb地址
if(env=="development"){
     dbUrl="mongodb://localhost/shop_kxx";
}
mongoose.connect(dbUrl,{useNewUrlParser:true},function(err){
    if(err){
        console.log('Connection Error:' + err)
    }else{
        console.log('Connection success!') }
});*/
var dbUrl="mongodb://localhost/shop_kxx";
mongoose.connect(dbUrl,{useNewUrlParser:true},function(err){
    if(err){
        console.log('Connection Error:' + err)
    }else{
        console.log('Connection success!') }
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname,'./static'))); //查看静态文件

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/heros', herosRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
