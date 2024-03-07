import express from "express";
import ProductManager from "../dao/db/product-manager-db.js";


const router = express.Router();
const productManager = new ProductManager();

router.get("/", async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;

        
        const product = await productManager.getProducts({
            limit: parseInt(limit),
            page: parseInt(page),
            sort,
            query,
        });

        res.render("index", {prod: product,
            hasPrevPage: product.hasPrevPage,
            hasNextPage: product.hasNextPage,
            prevPage: product.prevPage,
            nextPage: product.nextPage,
            currentPage: product.page,
            totalPages: product.totalPages,
            limit: product.limit,
            prevLink: product.hasPrevPage ? `/api/products?limit=${limit}&page=${product.prevPage}&sort=${sort}&query=${query}` : null,
            nextLink: product.hasNextPage ? `/api/products?limit=${limit}&page=${product.nextPage}&sort=${sort}&query=${query}` : null,
            user: req.session.user
        })

    } catch (error) {
        console.log("error al obtener producto", error);
        res.status(500).json({
            error: "Error en el servidor"
        });
    }
})


router.get("/:pid", async (req, res) => {
    const pid = req.params.pid;
    try {
        const product = await productManager.getProductsById(pid);
        if (!product) {
            return res.json({
                error: "producto no encontrado"
            })
        }
        res.json(product);
    } catch (error) {
        console.log("error al obtener producto", error);
        res.status(500).json({
            error: "Error en el servidor"
        });
    }

});

router.post("/", async (req, res) => {

    const newProduct = req.body;
    try {
        await productManager.addProduct(newProduct);
        res.send({ status: "Success", message: "Producto Creado" });

    } catch (error) {
        console.log("error al agregar producto", error);
        res.status(500).json({
            error: "Error en el servidor"
        });
    }

})

router.put("/:id", async (req, res) => {

    const id = req.params.id;
    const modifyProduct = req.body;
    try {
        await productManager.updateProductById(id, modifyProduct);
        res.send({ status: "Success", message: "Producto Actualizado" });
    } catch (error) {
        console.log("error al actualizar producto", error);
        res.status(500).json({
            error: "Error en el servidor"
        });
    }
})

router.delete("/:id", async (req, res) => {
    const id = req.params.id;
    try {
        await productManager.deleteProductById(id);
        res.send({ status: "Success", message: "Producto Eliminado" });
    } catch (error) {
        console.log("error al eliminar el producto", error);
        res.status(500).json({
            error: "Error en el servidor"
        });
    }
})

export default router;