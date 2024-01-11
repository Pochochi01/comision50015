import express from "express";
const router = express.Router();
import ProductManager from "../controllers/product-manager.js";
const manager = new ProductManager("./src/models/products.json");



router.get("/", async(req,res)=>{
    let limit = parseInt(req.query.limit);
    res.send(await manager.readLimitProduct(limit));
})


router.get("/:pid", async (req, res) => {
    let pid = parseInt(req.params.pid);
    res.send(await manager.getProductById(pid));
});

router.post("/", async (req, res) => {
    try {
        const newProduct = req.body;
        manager.addProduct(newProduct);
        res.send({ status: "Success", message: "Producto Creado" });
    } catch (error) {

    }

})

router.put("/:id", async (req, res) => {
    try {
        let id  = parseInt(req.params.id);
        const modifyProduct = req.body;
        manager.updateProduct(id, modifyProduct);
        res.send({ status: "Success", message: "Producto Actualizado" });
    } catch (error) {

    }
})

router.delete("/:id", async (req, res) => {
    let { id } = req.params;
    res.send(await manager.deleteProductById(id));
})

export default router;