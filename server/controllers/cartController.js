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

    if (cart) {
      return res.status(200).send({ error: false, message: null, data: cart });
    }
    return res
      .status(400)
      .send({ error: true, message: "Cannot create cart for this user!" });
  },

  updateCart(req, res) {
    try {
      const { productId } = req.params;
      const {quantity} = req.body;
      if(!productId) {
        return res
          .status(400)
          .send({ error: true, message: "Please specify the product id and quantity", data: null});
      }
      const product = Product.findById(productId);
      if (!product) {
        return res
          .status(400)
          .send({ error: true, message: "No product found!", data: null });
      }

      const user = req.user;
      const cart = findByUserId(user.id);
      if (!cart) {
        return res
          .status(400)
          .send({ error: true, message: "Cannot find cart for this user!" });
      }

      const item = cart.getItemByProductId(product.id);
      const requiredQuantity = item ? item.quantity + quantity : quantity;
      
      if(requiredQuantity < 1) {
        cart.deleteItemByProductId(product.id);
        return res
          .status(200)
          .send({ error: false, message: `${product.name} is removed sucessfully` });
      }

      if(!product.checkStok(requiredQuantity)) {
        return res
          .status(400)
          .send({ error: true, message: "No stock" });
      }
      cart.updateCart(product, quantity);

      return res.status(200).send({ error: false, message: null, data: cart });
    } catch (e) {
      return res.status(200).send({ error: true, message: 'Internal Error', data: null });
    }
  },
};
