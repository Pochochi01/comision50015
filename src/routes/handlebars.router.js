import express from "express"
const router = express.Router(); 
import ProductManager from "../controllers/product-manager.js";
const productManager = new ProductManager("./src/models/productos.json");

router.get("/", async (req, res) => {
    try {
        const productos = await productManager.getProducts();
        res.render("index", {
            productos: productos
        });
    } catch (error) {
        console.error("Error al obtener productos", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
})


router.get("/realtimeproducts", async (req, res) => {
    try {
        res.render("realtimeproducts");
    } catch (error) {
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
})

export default router; 