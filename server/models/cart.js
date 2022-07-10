const CartItem = require('./cartItem');
const User = require('./user');

const cartDB = [];
let counter = 1;
module.exports = class Cart {

    constructor(userId) {
        this.id = ++counter;
        this.userId = userId;
        this.items = [];
        cartDB.push(this);
    }

    static findByUserId(userId) {
        if(userId && User.findById(userId)) {
            const userCart = cartDB.find(cart => cart.userId == userId);
            if(!userCart) {
                return null;
            }
            return userCart;
        } else {
            throw new Error('User not vaild!')
        }
    }

    addToCart(product) {
        this.items.push(new CartItem(product.id, product.name, product.price, 1));
        cartDB[cartDB.findIndex(cart => cart.id == this.id)] = this;
    }

}