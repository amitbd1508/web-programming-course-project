const Cart = require("../models/cart");
const { findByUserId } = require("../models/cart");
const Product = require("../models/product");

module.exports = {
  getCart(req, res) {
    const user = req.user;
    let cart = findByUserId(user.id);
    if (!cart) {
      cart = new Cart(user.id);
    }
    console.log(cart);

    if (cart) {
      return res.status(200).send({ error: false, message: null, data: cart });
    }
    return res
      .status(400)
      .send({ error: true, message: "Cannot create cart for this user!" });
  },

  addToCart(req, res) {
    try {
      const { productId } = req.params;
      const product = Product.findById(productId);
      if (!product) {
        return res
          .status(400)
          .send({ error: true, message: "No product found!" });
      }

      if(!product.checkStok(1)) {
        return res
          .status(400)
          .send({ error: true, message: "No stock" });
      }

      const user = req.user;
      const cart = findByUserId(user.id);
      if (!cart) {
        return res
          .status(400)
          .send({ error: true, message: "Cannot find cart for this user!" });
      }
      cart.addToCart(product);

      return res.status(200).send({ error: false, message: null, data: cart });
    } catch (e) {
      console.log(e);
    }
  },
};
