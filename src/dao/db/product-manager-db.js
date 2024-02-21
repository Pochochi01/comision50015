import ProductsModels from "../models/products.models.js";

class ProductManager {
    async addProduct(newObjet) {
        let { title, description, code, price, status, stock, category, thumbnail } = newObjet;
        try {
            if (!title || !description || !code || !price || !status || !stock || !category || !thumbnail) {
                console.log("Completar todos los campos");
                return;
            }

            const productExist = await ProductsModels.findOne({ code: code });

            if (productExist) {
                console.log("El codigo ya existe, ingrese otro codigo por favor")
                return;
            }

            const newProduct = new ProductsModels({
                title,
                description,
                code,
                price,
                status: true,
                stock,
                category,
                thumbnail: thumbnail || []
            });
            await newProduct.save()

        } catch (error) {
            console.log("Error al agregar el producto", error);
            throw error;
        }
    }

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

            const products = await ProductsModels
                .find(queryOption)
                .sort(sortOptions)
                .skip(skip)
                .limit(limit);

            const totalProducts = await ProductsModels.countDocuments(queryOption);

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
            const products = await ProductsModels.findById(id)
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

    async updateProductById(id, body) {
        try {
            const updateProduct = await ProductsModels.findByIdAndUpdate(id, body);
            if (!updateProduct) {
                console.log("no se encontro el producto");
                return null
            } else
                return updateProduct;
        } catch (error) {
            console.log("error al actualizar el producto", error);
        }
    }

    async deleteProductById(id) {
        try {
            const deleteProduct = await ProductsModels.findByIdAndDelete(id)
            if (!deleteProduct) {
                console.log("Producto no encontrado");
            } else {
                console.log("Producto eliminado");
            }
        } catch (error) {
            console.log("No se pudo conectar para eliminar");
        }
    }
}

export default ProductManager;