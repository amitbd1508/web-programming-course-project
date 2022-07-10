const Cart = require("../models/cart");
const { findByUserId } = require("../models/cart");

module.exports = {
  getCart(req, res) {
    try {
      const user = req.user;
      let cart = findByUserId(user.id);
      console.log(cart);
      if (!cart) {
        cart = new Cart(user.id);
      }
      console.log(cart);

      if (cart) {
        return res
          .status(200)
          .send({ error: false, message: null, data: cart });
      }
      return res.status(400).send({error: true, message: 'Cannot create cart for this user!'})

    } catch (e) {
        console.log(e);
    }
  },
};
