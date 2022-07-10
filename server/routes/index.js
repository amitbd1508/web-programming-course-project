const { Router } = require('express');
const productRouter = require('./productRouter');

const baseRouter = Router();

baseRouter.use('/products', productRouter);


module.exports = baseRouter;