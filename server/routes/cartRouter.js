const { Router } = require("express");
const { getCart, addToCart } = require('../controllers/cartController');

const cartRouter = Router();

cartRouter.get(`/`, getCart);
cartRouter.post(`/item/:productId`, addToCart);

module.exports = cartRouter;
