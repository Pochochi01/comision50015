import express from "express";
const router = express.Router();
import CartManager from "../controllers/cart-manager.js";
const manager = new CartManager("./src/models/carrito.json");

router.post("/", async (req, res) => {
    res.send(await manager.addCart());
})

router.get("/", async (req, res) => {
    res.send(await manager.readCart());
})

router.get("/:id", async (req,res) => {
    let id = parseInt(req.params.id);
    res.send(await manager.getCartById(id));
})

router.post("/:cid/products/:pid", async(req,res) => {
    let cartId = parseInt(req.params.cid);
    let productId = parseInt(req.params.pid);
    let quantity = req.body.quantity || 1;
    res.send(await manager.addProductToCart(cartId,productId, quantity));
}) 

export default router;

