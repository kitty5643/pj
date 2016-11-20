var express = require('express');
var app = express();

app.get('/', function(req, res) {
  res.send('Hello World!');
});
app.get('/0', function(req, res, next) {
  res.send('Hello World!');
});

app.get('/0n', function(req, res, next) {
  res.send('Hello World!');
  next();
});

app.use(function(req,res,next) { // middleware #1
  console.log(req.method + ' ' + req.path + ' was requested at ' + Date.now());
  next();
});

app.use(function(req,res,next) { // middleware #2
  console.log('User agent is ' + req.headers['user-agent']);
  if (req.headers['user-agent'].indexOf('Mac') < 0) {
    res.end('We do not support Apple Computers!')
  } else {
    next();
  }
});


app.get('/1', function(req, res) {
  res.send('Hello World!');
});
app.get('/2', function(req, res, next) {
  res.send('Hello World!');
});

app.listen(process.env.PORT || 8099);
