import express from "express";
const router = express.Router();
import CartManager from "../dao/db/cart-manager-db.js";
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
        const cartById = await cartManager.getCartById(id);
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

export default router;

