import ProductService from "../services/product.service.js";

const productService = new ProductService();

class ProductController {

    async getProducts(req, res) {
        try {
            const { limit = 10, page = 1, sort, query } = req.query;
            const product = await productService.getProducts({
                limit: parseInt(limit),
                page: parseInt(page),
                sort,
                query,
            });

            res.render("index", {
                prod: product,
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
    }

    
    async getProductsById (req, res) {
        const pid = req.params.pid;
        try {
            const product = await productService.getProductsById(pid);
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
    
    }
    
    

}

export default ProductController;