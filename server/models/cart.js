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

    getItemByProductId(productId) {
        const index = this.items.findIndex(item => item.productId == productId);
        if(index < 1)
            return null;
        return this.items[index];
    }

    addToCart(product) {
        const index = cartDB.findIndex(cart => cart.id == this.id);
        let found =false;
        for(let i=0; i< cartDB[index].items.length; i++) {
            if(cartDB[index].items[i].productId == product.id) {
                cartDB[index].items[i].quantity += 1;
                found = true;
            }
        }

        if(!found) {
            this.items.push(new CartItem(product.id, product.name, product.price, 1));
            cartDB[index] = this;
        }
    }

}