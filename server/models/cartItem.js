module.exports = class CartItem {

    constructor(productId, name, price, quantity) {
        this.productId = productId;
        this.name = name;
        this.price = price;
        this.quantity = quantity;
    }
}