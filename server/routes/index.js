const { Router } = require('express');
const productRouter = require('./productRouter');
//const cartRouter = require('./order');

const baseRouter = Router();

baseRouter.use('/products', productRouter);
//baseRouter.use('/orders', cartRouter);


module.exports = baseRouter;