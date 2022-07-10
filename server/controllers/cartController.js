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
      const { quantity } = req.body;
      if (!productId) {
        return res
          .status(400)
          .send({
            error: true,
            message: "Please specify the product id!",
            data: null,
          });
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

      if (!product.checkStok(quantity)) {
        return res.status(400).send({ error: true, message: "No stock" });
      }
      cart.updateCart(product, quantity);
    
      const item = cart.getItemByProductId(product.id);
      if (item.quantity < 1) {
        cart.deleteItemByProductId(product.id);
        return res
          .status(200)
          .send({
            error: false,
            message: `${product.name} is removed sucessfully`,
          });
      }

      return res.status(200).send({ error: false, message: null, data: cart });
    } catch (e) {
      console.log(e);
      return res
        .status(200)
        .send({ error: true, message: "Internal Error", data: null });
    }
  },

  placeOrder(req, res) {
    const user = req.user;
    console.log('\n in cart',JSON.stringify(Cart.getCarts()));

    const cart = Cart.findByUserId(user.id);
    if (!cart || cart.items.length < 1) {
      return res
        .status(400)
        .send({ error: true, message: "Cannot place order for empty cart!" });
    }
    try {
      cart.items.map((item) => {
        const product = Product.findById(item.productId);
        
        if(!product) {
          return res
          .status(400)
          .send({ error: true, message: `${item.name} is not available. Please update your cart` });
        }
        
        if(product.stock >= item.quantity) {
          product.stock -= item.quantity;
          product.update();
        } else {
          return res
          .status(400)
          .send({ error: true, message: `${product.stock} ${product.name} items is availabily. Please update your cart` });
        }
      });

      cart.emptyCartItems();
      return res
        .status(200)
        .send({ error: false, message: "Order place sucessfully!" });
    } catch (e) {
      console.log(e)
      return res.status(500).send({ error: true, message: "Internal Error" });
    }
  },
};
