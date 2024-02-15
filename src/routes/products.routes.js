import express from "express";
import ProductManager from "../dao/db/product-manager-db.js";


const router = express.Router();
const productManager = new ProductManager();
/*
//////////////    MONGOOSE     //////////////

router.get("/mongoose", async (req, res) => {
    try {
        const products = await productManager.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "error al conectarse al servidor" })
    }
})

router.post("/mongoose", async (req, res) => {
    try {
        const newProduct = new productManager(req.body);
        await newProduct.save();
        res.send({ resultado: "success", newProduct: newProduct });
    } catch (error) {
        res.status(500).json({ message: "error al conectarse al servidor" })
    }
})

router.put("/mongoose/:pid", async (req, res) => {
    let { pid } = req.params;
    let productReplace = req.body;

    if (!productReplace.title || !productReplace.description || !productReplace.code || !productReplace.price || !productReplace.status || !productReplace.stock || !productReplace.category || !productReplace.thumbnail) {
        return res.send({ status: "error", error: "Debe completar todos los campos" });
    } else {
        let result = await productManager.updateOne({ _id: pid }, productReplace);
        res.send({ status: "success", productReplace: result });
    }
})

router.delete("/mongoose/:pid", async (req, res) => {
    let { pid } = req.params;
    let result = await productManager.deleteOne({ _id: pid })
    res.send({ status: "success", productDelete: result })
})
///////////////////////////////////////////////////////*/

router.get("/", async (req, res) => {
    try {
        const limit = req.query.limit || 1;
        const page = req.query.page || 2;
        
        const product = await productManager.getProducts(limit, page);
        console.log(product)
        res.render("index", {prod: product,
            hasPrevPage: product.hasPrevPage,
            hasNextPage: product.hasNextPage,
            prevPage: product.prevPage,
            nextPage: product.nextPage,
            currentPage: product.page,
            totalPages: product.totalPages,
            limit: product.limit
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