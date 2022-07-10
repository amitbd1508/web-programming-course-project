const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
    res.status(200).json(Product.fetchAll());
}

exports.getProductById = (req, res, next) => {
    res.status(200).json(Product.findById(req.params.prodId));
}

exports.save = (req, res, next) => {
    const prod = req.body;
    const savedProd = new Product(null, prod.name, prod.price, prod.imgUrl, prod.stock).save();
    res.status(201).json(savedProd);
}

exports.update = (req, res, next) => {
    const prod = req.body;
    const updatedProd = new Product(req.params.prodId,  prod.name, prod.price, prod.imgUrl, prod.stock).update();
    res.status(200).json(updatedProd);
}

exports.deleteById = (req, res, next) => {
    Product.deleteById(req.params.prodId);
    res.status(200).end();
}