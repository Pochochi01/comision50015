import fs from "fs";
import ProductManager from "./product-manager.js";
const managerProduct = new ProductManager("./src/models/products.json");

class CartManager {
    constructor() {
        this.path = "./src/models/carrito.json";
        this.ultId = 0;
    }

    async exist(id) {
        let carts = await this.readCart();
        let finded = carts.find(item => item.id === id);
        return finded;
    }

    async readCart() {
        try {
            const answer = await fs.readFileSync(this.path, "utf-8");
            let arrayCarts = JSON.parse(answer);

            this.ultId = Math.max(...arrayCarts.map(cart => cart.id));
            if (this.ultId === 0) {
                this.ultId = 1;
            } 
            return arrayCarts;
        } catch (error) {
            console.log("Error al leer un archivo", error);
        }
    }

    async addCart() {
        let cartArray = await this.readCart();
        const newCart = {
            id: ++this.ultId,
            product: []
        }
        console.log(cartArray)
        console.log(newCart)

        cartArray.push(newCart);
        await this.saveFile(cartArray)
    }


    async saveFile(arrayCart) {
        try {
            await fs.writeFileSync(
                this.path,
                JSON.stringify(arrayCart, null, 2)
            );
        } catch (error) {
            console.log("Error al guardar el archivo", error);
        }
    }


    async getCartById(id) {
        try {
            const encontrado = await this.exist(id);
            if (!encontrado) {
                return "Producto no encontrado";
            } else {
                return encontrado;
            }
        } catch (error) {
            console.log("Error al leer el archivo", error);
        }
    }




    async addProductToCart(cid, pid, quantity = 1) {
        try {
            const cartById = await this.exist(cid);
            if (!cartById) {
                return "Carrito no encontrado";
            } else {
                const productById = await managerProduct.exist(pid)
                if (!productById) {
                    return "Producto no encontrado";
                }
                else { // buscar por indice y actualizar el arreglo
                    const arrayCart = await this.readCart();
                    let productExist = cartById.product.find(p => p.id === pid);
                    if (productExist) {
                        const finded = arrayCart.findIndex(c => c.id === cid);
                        if (finded !== -1) {
                            productExist.quantity += quantity;
                            arrayCart.splice(finded, 1, { id: cid, product: [productExist] });
                            await this.saveFile(arrayCart);
                        }
                    } else {
                        const finded = arrayCart.findIndex(c => c.id === cid);
                        if (finded !== -1) {
                            cartById.product.push({ "id": pid, quantity });
                            arrayCart.splice(finded, 1, cartById);
                            await this.saveFile(arrayCart)
                        }
                    }
                }
                return cartById;
            }
        } catch (error) {
        }
    }
}
export default CartManager;