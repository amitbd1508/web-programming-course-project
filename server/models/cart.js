const { use } = require("../routes/productRouter");

let db = [];

function outer(){
    let inc=0;
    return function(){
        inc++;
        return inc;
    }
}

const getNextId = outer();

module.exports = class Cart {
    constructor(id, userId) {
        this.id = id;
        this.userId = userId;
        this.orderItems = [];
    }

    save(){
        this.id = getNextId();
        db.push(this);
        return this;
    }

    deleteCartItem(ciid){
        let index = this.orderItems.findIndex(u=>u.id==ciid);
        if(index>-1){
            const deleted = this.orderItems[index];
            this.orderItems.splice(index,1);
            return deleted;
        }
        return null;
    }
    updateQuantity(orderItemId, newQuantity){
        var oi = this.orderItems.find(u=>u.id==orderItemId);
        if(oi!=null){
            oi.quantity = newQuantity;
            oi.total = oi.quantity * oi.price;
            return oi;
        }
        return null;
    }

    addOrderItem(orderitem){
        
        var itemdb = this.orderItems.find(oi=> oi.productId == orderitem.productId);
        if(itemdb== null){
            this.orderItems.push(orderitem.save());
            return orderitem;
        }else{
            itemdb.quantity++;
            itemdb.total = itemdb.quantity * itemdb.price;
            return itemdb;
        }
    };
    static getByUserId(userId){
        let userCart = db.find(cart=> cart.userId== userId);
        if(userCart == null){
            userCart = new Cart(null, userId);
            userCart.save();

        }
        return userCart;
    }


}