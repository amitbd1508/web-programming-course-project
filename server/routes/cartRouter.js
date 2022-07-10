const { Router } = require("express");
const { getCart } = require('../controllers/cartController');

const cartRouter = Router();

cartRouter.get(`/`, getCart);

module.exports = cartRouter;
