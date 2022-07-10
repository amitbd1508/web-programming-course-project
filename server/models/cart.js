let carts = new Map();

module.exports = class Cart {
    constructor(username) {
        this.id = username
        this.cartItems = [];
        carts.set(this.id, this);
        return this;
    }

    getByUser(username) {
        return this.carts.get(username);
    }

    addItemByUser(username, product, quantity) {
        const cart = this.getCartByUser(username);
        if(!cart) throw new Error("Cart not found for this user");
        cart.cartItems.push(new CartItem(product, quantity))
    }
}