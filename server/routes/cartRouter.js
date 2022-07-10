const { Router } = require("express");
const { getCart, updateCart } = require('../controllers/cartController');

const cartRouter = Router();

cartRouter.get(`/`, getCart);
cartRouter.patch('/:productId', updateCart);

module.exports = cartRouter;
