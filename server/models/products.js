let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// let modelSchema = new mongoose.Schema({
//   "productList": [productSchema],
//   "branchList": [branchSchema],
//   "categoryList": [categorySchema]
// });

let productSchema = new mongoose.Schema({
  "productName": String,
  "branch": String,
  "category": String,
  "letter": String,
  "dateTime": String,
  "productDetail": String,
  "productImage": String,
  "status": Number
});

let branchSchema = new mongoose.Schema({
  "branchName": String
});

let categorySchema = new mongoose.Schema({
  "categoryName": String
});

let model = {
  "product": mongoose.model('Product', productSchema),
  "branch": mongoose.model('Branch', branchSchema, 'branch'),
  "category": mongoose.model('Category', categorySchema, 'category')
}

module.exports = model;
