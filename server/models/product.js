let productDB = [];

module.exports = class Product {

    constructor(id, name, price, imgUrl, stock) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.imgUrl = imgUrl;
        this.stock = stock;
    }

    static insertAll(products) {
        console.log()
        products.map(product => productDB.push(new Product(product.id, product.name, product.price, product.imgUrl, product.stock)));
    }

    save() {
        this.id = Math.random().toString();
        productDB.push(this);
        return this;
    }

    delete() {
        const index = productDB.findIndex(p => p.id == this.id);
        if (index > -1) {
            productDB = productDB.filter(p => {
                console.log(',,,,', p.id, '----', this.id);
                return p.id != this.id;
            });
        } else {
            throw new Error('NOT Found');
        }
    }

    update() {
        const index = productDB.findIndex(p => p.id === this.id);
        if (index > -1) {
            productDB.splice(index, 1, this);
            return this;
        } else {
            throw new Error('NOT Found');
        }

    }

    checkStok(quantity) {
        return this.stock >= quantity;
    }

    static fetchAll() {
        return productDB;
    }

    static findById(productId) {
        const index = productDB.findIndex(p => p.id == productId);
        if (index < 0) {
            return null;
        } 
        return productDB[index];
    }

    static deleteById(productId) {
        const index = productDB.findIndex(p => p.id === productId);
        if (index > -1) {
            productDB = productDB.filter(p => p.id !== productId);
        } else {
            throw new Error('NOT Found');
        }
    }

}