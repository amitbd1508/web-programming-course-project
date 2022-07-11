const Product = require('../models/product');

exports.getProducts = (req, res) => {
    res.status(200).json(Product.fetchAll());
}