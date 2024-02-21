import express from "express";
import CartModel from "../dao/models/carts.models.js";
import CartManager from "../dao/db/cart-manager-db.js";


const router = express.Router();
const cartManager = new CartManager();

router.post("/", async (req, res) => {
try {
    const newCart = await cartManager.createCart();
    res.json(newCart)    ;
} catch (error) {
    console.error("error al crear el carrito", error);
    res.status(500).json({error: "error interno del servidor"});
}
})

router.get("/:id", async (req,res) => {
    const id = req.params.id;
    try {
        const cartById = await CartModel.getCartById(id);
        res.json(cartById)    
    } catch (error) {
        console.error("error al obtener el carrito",error);
        res.status(500).json({error: "error interno del servidor"});
    }
    

})

router.post("/:cid/products/:pid", async(req,res) => {
    let cartId = req.params.cid;
    let productId = req.params.pid;
    let quantity = req.body.quantity || 1;
    try {
        const productToCart = await cartManager.addProductToCart(cartId,productId, quantity); 
        res.json(productToCart.products);
    } catch (error) {
        console.error("error al agregar productos al carrito",error);
        res.status(500).json({error: "error interno del servidor"});
    }
    
})


//////////////////////////////////////////////////////////////////////////
router.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;

        const updatedCart = await cartManager.deleteProductById(cartId, productId);

        res.json({
            status: 'success',
            message: 'Producto eliminado del carrito correctamente',
            updatedCart,
        });
    } catch (error) {
        console.error('Error al eliminar el producto del carrito', error);
        res.status(500).json({
            status: 'error',
            error: 'Error interno del servidor',
        });
    }
});

router.put('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    const updatedProducts = req.body;
    // Debes enviar un arreglo de productos en el cuerpo de la solicitud

    try {
        const updatedCart = await cartManager.updateCarts(cartId, updatedProducts);
        res.json(updatedCart);
    } catch (error) {
        console.error('Error al actualizar el carrito', error);
        res.status(500).json({
            status: 'error',
            error: 'Error interno del servidor',
        });
    }
});

router.put('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const newQuantity = req.body.quantity;

        const updatedCart = await cartManager.updateQuantity(cartId, productId, newQuantity);

        res.json({
            status: 'success',
            message: 'Cantidad del producto actualizada correctamente',
            updatedCart,
        });
    } catch (error) {
        console.error('Error al actualizar la cantidad del producto en el carrito', error);
        res.status(500).json({
            status: 'error',
            error: 'Error interno del servidor',
        });
    }
});

router.delete('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        
        const updatedCart = await cartManager.deleteProductsByCart(cartId);

        res.json({
            status: 'success',
            message: 'Todos los productos del carrito fueron eliminados correctamente',
            updatedCart,
        });
    } catch (error) {
        console.error('Error al vaciar el carrito', error);
        res.status(500).json({
            status: 'error',
            error: 'Error interno del servidor',
        });
    }
});
export default router;

