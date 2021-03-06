var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
// var ejs = require('ejs');

var products = require('./routes/products');

var app = express();

app.use(cors({
  origin:['http://localhost:9527', 'http://www.tjlenda.com'],
  methods:['GET','POST', 'PUT', 'DELETE', 'OPTIONS'],
  alloweHeaders:['Content-Type', 'Authorization']
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.engine('.html', ejs.__express);
// app.set('view engine', 'html');  // 使用html模板引擎
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads',express.static(path.join(__dirname, 'uploads')));
// app.use(function (req, res, next) {
//   if(req.cookies.userId) {
//     next();
//   }else {
//     if(req.path == '/users/login' || req.path == '/goods/list') {
//       next();
//     }else {
//       res.json({
//         status: '10001',
//         msg: '当前未登录',
//         result: ''
//       });
//     }
//   }
// });

app.use('/', products);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
