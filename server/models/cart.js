const CartItem = require('./cartItem');
const User = require('./user');

let cartDB = [];
let counter = 0;
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
        if(index < 0)
            return null;
        return this.items[index];
    }

    deleteItemByProductId(productId) {
        cartDB[cartDB.findIndex(cart => cart.id == this.id)].items = this.items.filter(item => item.productId != productId);
    }

    updateCart(product, quantity) {
        const index = cartDB.findIndex(cart => cart.id == this.id);
        let found =false;
        for(let i=0; i< cartDB[index].items.length; i++) {
            if(cartDB[index].items[i].productId == product.id) {
                cartDB[index].items[i].quantity += quantity;
                found = true;
            }
        }

        if(!found) {
            this.items.push(new CartItem(product.id, product.name, product.price, quantity));
            cartDB[index] = this;
        }
    }

}