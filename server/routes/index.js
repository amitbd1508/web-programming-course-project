const { Router } = require('express');
const productRouter = require('./productRouter');
const cartRouter = require('./cartRouter');

const baseRouter = Router();

baseRouter.use('/products', productRouter);
baseRouter.use('/carts', cartRouter);

module.exports = baseRouter;