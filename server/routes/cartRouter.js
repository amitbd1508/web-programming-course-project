const { Router } = require("express");
const { getCart, updateCart, placeOrder } = require('../controllers/cartController');

const cartRouter = Router();

cartRouter.get(`/`, getCart);
cartRouter.patch('/:productId', updateCart);
cartRouter.post('/placeOrder', placeOrder)

module.exports = cartRouter;
