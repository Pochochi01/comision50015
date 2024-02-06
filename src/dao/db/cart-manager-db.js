import CartModel from "../models/carts.models.js";

class CartManager{
    async createCart(){
        try {
            const newCart = new CartModel({products:[]});
            await newCart.save();
            return newCart;
        } catch (error) {
            console.log("Error al crear el carrito")
        }
    }

    async getCartByID(id){
        try {
            const cart = new CartModel.findById(id);
            if(!cart){
                console.log("No se encontro el carrito");
                return null;
            } else {
                return cart;
            }
        } catch (error) {
            console.log("error al buscar el Id en el carrito")
        }
    }

    async addProductToCart(cid,pid, quantity = 1){
        try {
            const cart = await this.getCartByID(cid);
            const productExist = cart.products.find(item => item.product.toString() === pid);
            if (productExist){
                productExist.quantity += quantity;
            } else {
                cart.products.push({product: pid, quantity});
            }
            cart.markModified("products");
            await cart.save();
            return cart;
        } catch (error) {
            console.log("error al cargar productos al carrito")
            
        }
    }
}

export default CartManager;