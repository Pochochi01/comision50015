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

    async getProducts(limit,page) {
        try {
            const products = await ProductsModels.paginate({},{limit,page});
            const finalProducts = products.docs.map(product =>{
                const {_id, ...prod} = product.toObject();
            })
            return products;
        } catch (error) {
            console.log("No se encontraron Productos", error)
        }
    }

    async getProductsById(id){
        try {
            const products = await ProductsModels.findById(id)
            if(!products){
                console.log("Producto no encontrado");
                return null;
            } else{
                return products;
            }
        } catch (error) {
            console.log("No se encontro el Producto con el ID solicitado");
        }
    }

    async updateProductById(id, body){
        try {
            const updateProduct = await ProductsModels.findByIdAndUpdate(id,body);
            if(!updateProduct){
                console.log("no se encontro el producto");
                return null
            } else
            return updateProduct;
        } catch (error) {
            console.log("error al actualizar el producto",error);
        }
    }

    async deleteProductById(id){
        try {
            const deleteProduct = await ProductsModels.findByIdAndDelete(id)
            if (!deleteProduct){
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