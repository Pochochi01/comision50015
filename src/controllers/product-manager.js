import fs from "fs";

class ProductManager {
  constructor() {
    this.path = "./src/models/products.json";
  }

  async addProduct(newObjet) {
    let { title, description, code, price, status, stock,category, thumbnail } = newObjet;
    let productAll = await this.readProduct();
    let id = parseInt(productAll.length);
    console.log(id)
    for (let i = 0; i < productAll.length; i++) {
      if (productAll[i].code === code) {
        console.log(`El Codigo ${code} ya existe`);
        return;
      }
    }
    const newProduct = { title, description, code, price, status, stock,category, thumbnail };
    console.log(newProduct)
    if (!Object.values(newProduct).includes(undefined)) {
      id++;
      productAll.push({ ...newProduct, id: id });
    } else {
      console.log("Debe Completar Todos los Campos");
    }
    await this.saveFile(productAll);
  }

  getProducts() {
    return this.products;
  }

  async exist(id) {
    let products = await this.readProduct();
    let finded = products.find(item => item.id == id);
    return finded;
  }

  async readProduct() {
    try {
      const answer = await fs.readFileSync(this.path, "utf-8");
      const arrayProductos = JSON.parse(answer);
      return arrayProductos;
    } catch (error) {
      console.log("Error al leer un archivo", error);
    }
  }

  async readLimitProduct(limit) {
    try {

      let arrayProductos = await this.readProduct()
      if (limit >= 0 && limit < arrayProductos.length){
        const result = arrayProductos.slice(0,limit);
        return result;
      } else {
       // return res.send({error: "limite ingresado fuera de rango del arreglo"});
        return arrayProductos;
      }
      
    } catch (error) {
      
    }
  }




  async saveFile(arrayProductos) {
    try {
      await fs.writeFileSync(
        this.path,
        JSON.stringify(arrayProductos, null, 2)
      );
    } catch (error) {
      console.log("Error al guardar el archivo", error);
    }
  }


  async getProductById(id) {
    try {
      const encontrado = await this.exist(id);
      if (!encontrado) {
        return "Producto no encontrado";

      } else {
        return encontrado;
      }
    } catch (error) {
      console.log("Error al leer el archivo", error);
    }
  }



  async updateProduct(id, productoActualizado) {
    try {
      const arrayProductos = await this.readProduct();
      const index = arrayProductos.findIndex(item => item.id === id);
      if (index !== -1) {
        arrayProductos.splice(index, 1, { ...productoActualizado, id: id });
        await this.saveFile(arrayProductos);
        console.log(`El Producto con ID ${id} a sido actualizado`);
      } else {
        console.log("no se encontró el producto");
      }
    } catch (error) {
      console.log("Error al actualizar el producto", error);
    }
  }

  async deleteProductById(id) {
    try {
      const arrayProductos = await this.readProduct();
      const index = arrayProductos.findIndex(item => item.id == id);
      if (index !== -1) {
        arrayProductos.splice(index, 1);
        await this.saveFile(arrayProductos);
        return (`El Producto con ID ${id} a sido eliminado`);
      } else {
        return ("No se encontró el producto");
      }
    } catch (error) {
      console.log("Error al eliminar el producto", error);
    }
  }
}

export default ProductManager;