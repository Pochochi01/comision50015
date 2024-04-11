import productModel from "../dao/models/products.models.js";

class ProductService {
    /*async createProduct(dataProduct){
        try {
            const product = new productModel(dataProduct);
            return await product.save();
        } catch (error) {
            throw new Error("Error al crear el producto");
        }
    }*/

    async getProducts({ limit = 10, page = 1, sort, query } = {}) {
        try {
            const skip = (page - 1) * limit;
            let queryOption = {};
            if (query) {
                queryOption = { category: query };
            }
            const sortOptions = {};
            if (sort) {
                if (sort === 'asc' || sort === 'desc') {
                    sortOptions.price = sort === 'asc' ? 1 : -1;
                }
            }

            const products = await productModel
                .find(queryOption)
                .sort(sortOptions)
                .skip(skip)
                .limit(limit);

            const totalProducts = await productModel.countDocuments(queryOption);

            const totalPages = Math.ceil(totalProducts / limit);
            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;

            return {
                docs: products,
                totalPages,
                prevPage: hasPrevPage ? page - 1 : null,
                nextPage: hasNextPage ? page + 1 : null,
                page,
                hasPrevPage,
                hasNextPage,
                prevLink: hasPrevPage ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
                nextLink: hasNextPage ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null,
            };
        } catch (error) {
            console.log("ERROR: No se pudo obtener los productos", error);
            throw error;
        }
    }

    async getProductsById(id) {
        try {
            const products = await productModel.findById(id)
            if (!products) {
                console.log("Producto no encontrado");
                return null;
            } else {
                return products;
            }
        } catch (error) {
            console.log("No se encontro el Producto con el ID solicitado");
        }
    }


}

export default ProductService;