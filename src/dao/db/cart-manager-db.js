import CartModel from "../models/carts.models.js";

class CartManager {
    async createCart() {
        try {
            const newCart = new CartModel({ products: [] });
            await newCart.save();
            return newCart;
        } catch (error) {
            console.log("Error al crear el carrito")
        }
    }

    async getCartById(id) {
        try {
            const cart = await CartModel.findById(id);
            if (!cart) {
                console.log("No se encontro el carrito");
                return null;
            } else {
                return cart;
            }
        } catch (error) {
            console.log("error al buscar el Id en el carrito")
        }
    }

    async addProductToCart(cid, pid, quantity = 1) {
        try {
            const cart = await this.getCartById(cid);
            const productExist = cart.products.find(item => item.product.toString() === pid);
            if (productExist) {
                productExist.quantity += quantity;
            } else {
                cart.products.push({ product: pid, quantity });
            }
            cart.markModified("products");
            await cart.save();
            return cart;
        } catch (error) {
            console.log("error al cargar productos al carrito")

        }
    }


async deleteProductsByCart(cartId, productId) {
    try {
        const cart = await CartModel.findById(cartId);

        if (!cart) {
            throw new Error('Carrito no encontrado');
        }

        //cart.products = cart.products.filter(item => item.product.toString() !== productId);
        cart.products = cart.products.filter(item => item.product._id.toString() !== productId);

        await cart.save();
        return cart;
    } catch (error) {
        console.error('Error al eliminar el producto del carrito en el gestor', error);
        throw error;
    }
}

async updateCarts(cartId, updatedProducts) {
    try {
        const cart = await CartModel.findById(cartId);

        if (!cart) {
            throw new Error('Carrito no encontrado');
        }

        cart.products = updatedProducts;

        cart.markModified('products');

        await cart.save();

        return cart;
    } catch (error) {
        console.error('Error al actualizar el carrito en el gestor', error);
        throw error;
    }
}

async updateQuantity(cartId, productId, newQuantity) {
    try {
        const cart = await CartModel.findById(cartId);

        if (!cart) {
            throw new Error('Carrito no encontrado');
        }

        const productIndex = cart.products.findIndex(item => item.product._id.toString() === productId);

        if (productIndex !== -1) {
            cart.products[productIndex].quantity = newQuantity;


            cart.markModified('products');

            await cart.save();
            return cart;
        } else {
            throw new Error('Producto no encontrado en el carrito');
        }
    } catch (error) {
        console.error('Error al actualizar la cantidad del producto en el carrito', error);
        throw error;
    }
}

async deleteProductsByCart(cartId) {
    try {
        const cart = await CartModel.findByIdAndUpdate(
            cartId,
            { products: [] },
            { new: true }
        );

        if (!cart) {
            throw new Error('Carrito no encontrado');
        }

        return cart;
    } catch (error) {
        console.error('Error al vaciar el carrito en el gestor', error);
        throw error;
    }
}

}
export default CartManager;