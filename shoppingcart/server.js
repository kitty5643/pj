var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var fileUpload = require('express-fileupload');

var SECRETKEY = 'I want to pass COMPS381F';

app.use(fileUpload());
app.use(bodyParser.json());
app.use(session({
  secret: SECRETKEY,
  resave: true,
  saveUninitialized: true
}));

app.use(function(req, res, next){
  if(req.session.cart == undefined){
    req.session.cart = [];
  }
  next();
});

var products = [
	{name: 'Apple iPad Pro', stock: 100, price: 7000, id:'001'},
	{name: 'Apple iPhone 7', stock: 50, price: 7800, id:'002'},
	{name: 'Apple Macbook', stock: 70, price: 11000, id: '003'}
];

app.set('view engine', 'ejs');

app.get("/read", function(req,res) {
  res.render("list", {c: products});
});

app.get('/showdetails', function(req,res) {
  if (req.query.id != null) {
    for (var i=0; i<products.length; i++) {
      if (products[i].id == req.query.id) {
        var product = products[i];
        break;
      }
    }
    if (product != null) {
      res.render('details', {c: product});
    } else {
      res.status(500).end(req.query.id + ' not found!');
    }
  } else {
    res.status(500).end('id missing!');
  }
});

app.get('/shoppingcart', function(req,res) {
  res.render('shoppingcart', {'c': req.session.cart});
});

app.get('/add2cart', function(req,res) {
  if (req.query.id != null) {
    console.log(req.session.cart.length);
    for (var i=0; i<req.session.cart.length; i++) {
      if (req.session.cart[i].id == req.query.id) {
        req.session.cart[i].qty++;
        res.redirect('/shoppingcart');
        return;
      }
    }
    for (var i=0; i<products.length; i++) {
      if (products[i].id == req.query.id) {
        var product = JSON.parse( JSON.stringify(products[i]) );
        product.qty = 1;
        break;
      }
    }
    if (product != null) {
      req.session.cart.push(product);
      res.redirect('/shoppingcart');
    } else {
      res.status(500).end(req.query.id + ' not found!');
    }
    
  } else {
    res.status(500).end('id missing!');
  }
});

app.get('/emptycart',function(req,res) {
  req.session.cart = [];
  res.redirect('/shoppingcart');
});

app.get('/new', function(req, res){
  res.render('new', {});
});
app.post('/upload', function(req, res){

    for (var i=0; i<products.length; i++) {
      if (products[i].id == req.body.id) {
        res.end('repeated id');
        return;
      }
    }

  var product = {
    name:  req.body.name,
    stock: req.body.stock,
    price: req.body.price,
    id: req.body.id
  };
  products.push(product);
  res.redirect('/read');
});

app.listen(process.env.PORT || 8099);
