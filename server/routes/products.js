var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var multer  = require('multer');

var model = require('../models/products');
var Product = model.product;
var Branch = model.branch;
var Category = model.category;

//设置保存路径
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../../lenda/images')
  },
  filename: function (req, file, cb) {
    var fileFormat = (file.originalname).split(".");
    cb(null, file.fieldname + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
  }
})

var upload = multer({ storage: storage })

// mongoose.connect('mongodb://root:passwd@127.0.0.1:27017/mall')
mongoose.connect('mongodb://127.0.0.1:27017/lenda');

mongoose.connection.on('connected', function () {
  console.log('MogoDB connected success.');
});

mongoose.connection.on('error', function () {
  console.log('MogoDB connected error.');
});

mongoose.connection.on('disconnected', function () {
  console.log('MogoDB disconnected.');
});

router.get('/', function(req, res, next) {
  res.send('respond with a resou');
});

/* GET product list. */
router.get('/product', function(req, res, next) {
  // let category = req.body.category;
  Product.find({"category": "Radiator"}, (err, doc) => {
    if(err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    }else {
      res.json({
        status: '0',
        msg: '',
        result: doc
      });
    }
  });
});

router.post('/upload', function(req, res, next) {
  let uploadImage = upload.single("file");

  uploadImage(req, res, function (err) {
    if (err) {
      res.json({
        status: '1',
        msg: '服务器错误，请稍后再试！',
        result: ''
      });
    }
    let file = req.file;
    res.json({
      status: '0',
      msg: '',
      result: file.filename
    });
  })
});

router.post('/product/add', function(req, res, next) {
  let product = new Product(req.body);
  // console.log(req.body);
  // let product = new Product({
  //   "productName": req.body.productName,
  //   "branch": req.body.branch,
  //   "category": req.body.category,
  //   "letter": req.body.letter,
  //   "productDetail": req.body.productDetail,
  //   "productImage": req.body.productImage
  // });
  product.save((err) => {
    if(err) {
      res.json({
        status: '1',
        msg: err.message
      });
    } else {
      res.json({
        status: '0',
        msg: '',
        result: 'success'
      });
    }
  });
});

/* GET branch list. */
router.get('/branch', function(req, res, next) {
  Branch.find({}, (err, doc) => {
    if(err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    }else {
      res.json({
        status: '0',
        msg: '',
        result: doc
      });
    }
  });
});

/* GET category list. */
router.get('/category', function(req, res, next) {
  // let category = req.body.category;
  Category.find({}, (err, doc) => {
    if(err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    }else {
      res.json({
        status: '0',
        msg: '',
        result: doc
      });
    }
  });
});

router.get('/checkLogin', function(req, res, next) {
  if(req.cookies.userId) {
    res.json({
      status: '0',
      msg: '',
      result: req.cookies.userName
    })
  }else {
    res.json({
      status: '1',
      msg: '未登录',
      result: ''
    })
  }
});

router.post('/logout', function(req, res, next) {
  res.cookie('userId', '', {
    path: '/',
    maxAge: 0
  });
  res.json({
    status: '0',
    msg: '',
    result: ''
  });
});

router.post('/login', function(req, res, next) {
  let param = {
    userName: req.body.userName,
    userPwd: req.body.userPwd
  };
  User.findOne(param, (err, doc) => {
    if(err) {
      res.json({
        status: '1',
        msg: err.message
      });
    }else {
      if(doc) {
        res.cookie('userId', doc.userId, {
          path: '/',
          maxAge: 1000*60*24*60
        });
        res.cookie('userName', doc.userName, {
          path: '/',
          maxAge: 1000*60*24*60
        });
        // req.session.user = doc;
        res.json({
          status: '0',
          msg: '',
          result: {
            userName: doc.userName,
          }
        });
      }
    }
  });
});

router.get('/cart', function(req, res, next) {
  let userId = req.cookies.userId
  User.findOne({ userId: userId }, (err, doc) => {
    if(err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    }else {
      if(doc) {
        res.json({
          status: '0',
          msg: '',
          result: doc.cartList
        });
      }
    }
  });
});

router.get('/getCartCount', function(req, res, next) {
  let userId = req.cookies.userId
  User.findOne({ userId: userId }, (err, doc) => {
    if(err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    }else {
      if(doc) {
        let cartCount = 0;
        doc.cartList.map((item) => {
          cartCount += parseInt(item.productNum);
        });
        res.json({
          status: '0',
          msg: '',
          result: cartCount
        });
      }
    }
  });
});

router.get('/address', function(req, res, next) {
  let userId = req.cookies.userId
  User.findOne({ userId: userId }, (err, doc) => {
    if(err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    }else {
      if(doc) {
        res.json({
          status: '0',
          msg: '',
          result: doc.addressList
        });
      }
    }
  });
});

router.post('/setDefault', function(req, res, next) {
  let userId = req.cookies.userId;
  let addressId = req.body.addressId;

  User.findOne({ 'userId': userId }, (err, doc) => {
    if(err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    }else {
      let addressList = doc.addressList;
      addressList.forEach((item) => {
        item.isDefault = item.addressId == addressId ? true : false;
      });

      doc.save((err, doc) => {
        if(err) {
          res.json({
            status: '1',
            msg: err.message,
            result: ''
          });
        }else {
          res.json({
            status: '0',
            msg: '',
            result: 'success'
          });
        }
      });
    }
  });
});

router.post('/cartDel', function(req, res, next) {
  let userId = req.cookies.userId;
  let productId = req.body.productId;
  User.update({ userId: userId }, { $pull: { 'cartList' : { 'productId': productId } } }, (err, doc) => {
    if(err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    }else {
      res.json({
        status: '0',
        msg: '',
        result: 'success'
      });
    }
  });
});

router.post('/addressDel', function(req, res, next) {
  let userId = req.cookies.userId;
  let addressId = req.body.addressId;
  User.update({ userId: userId }, { $pull: { 'addressList' : { 'addressId': addressId } } }, (err, doc) => {
    if(err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    }else {
      res.json({
        status: '0',
        msg: '',
        result: 'success'
      });
    }
  });
});

router.post('/cartEdit', function(req, res, next) {
  let userId = req.cookies.userId,
      productId = req.body.productId,
      productNum = req.body.productNum,
      checked = req.body.checked;

  User.update({ 'userId': userId, 'cartList.productId': productId }, {
    'cartList.$.productNum': productNum,
    'cartList.$.checked': checked
  }, (err, doc) => {
    if(err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    }else {
      res.json({
        status: '0',
        msg: '',
        result: 'success'
      });
    }
  });
});

router.post('/checkAll', function(req, res, next) {
  let userId = req.cookies.userId,
      checkAll = req.body.checkAll;
  User.findOne({ 'userId': userId }, (err, user) => {
    if(err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    }else {
      if(user) {
        user.cartList.forEach((item) => {
          item.checked = checkAll;
        });
        user.save((err, doc) => {
          if(err) {
            res.json({
              status: '1',
              msg: err.message,
              result: ''
            });
          }else {
            res.json({
              status: '0',
              msg: '',
              result: 'success'
            });
          }
        });
      }
    }
  });
});

router.post('/pay', function(req, res, next) {
  let userId = req.cookies.userId;
  let orderTotal = req.body.orderTotal;
  let addressId = req.body.addressId;

  User.findOne({ 'userId': userId }, (err, doc) => {
    if(err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    }else {
      let address = [], productList = [];
      doc.addressList.forEach((item) => {
        if(addressId == item.addressId) {
          address = item;
        }
      });

      doc.cartList.filter((item) => {
        if(item.checked) {
          productList.push(item)
        }
      });

      let r1 = Math.floor(Math.random() * 10);
      let r2 = Math.floor(Math.random() * 10);

      let date = new Date().Format('yyyyMMddhhmmss');
      let orderDate = new Date().Format('yyyy-MM-dd hh:mm:ss');
      let orderId = '2113' + r1 + date + r2;

      let order = {
        orderId: orderId,
        orderTotal: orderTotal,
        addressInfo: address,
        productList: productList,
        status: 1,
        date: orderDate
      };
      doc.orderList.push(order);

      doc.save((err, doc) => {
        if(err) {
          res.json({
            status: '1',
            msg: err.message,
            result: ''
          });
        }else {
          res.json({
            status: '0',
            msg: '',
            result: {
              orderId: order.orderId,
              orderTotal: order.orderTotal
            }
          });
        }
      });
    }
  });
});

module.exports = router;
