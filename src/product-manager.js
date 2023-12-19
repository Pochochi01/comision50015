const fs = require("fs");

class ProductManager {
  constructor(path) {
    this.products = [];
    this.path = path;
  }

  static id = 0;

  async addProduct(newObjet) {
    let { title, description, price, thumbnail, code, stock } = newObjet;

    for (let i = 0; i < this.products.length; i++) {
      if (this.products[i].code === code) {
        console.log(`El Codigo ${code} ya existe`);
        return;
      }
    }

    const newProduct = { title, description, price, thumbnail, code, stock };

    if (!Object.values(newProduct).includes(undefined)) {
      ProductManager.id++;
      this.products.push({ ...newProduct, id: ProductManager.id });
    } else {
      console.log("Debe Completar Todos los Campos");
    }
    await this.saveFile(this.products);
  }

 getProducts() {
   // console.log("El Arreglo es: ")
  //  console.log(this.products);
   return this.products;
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


  async getProductById(id) {
    try {
      const arrayProductos=await this.readProduct();
      const encontrado = arrayProductos.find(item => item.id === id);
      
      if (!encontrado)  {
      //console.log("Producto no encontrado");
        const encontrado = {error :"Producto no encontrado"};
        return encontrado;
    } else {
       // console.log(`Se encontro el Producto con ID ${id} :`);
       // console.log(encontrado);
        return encontrado;
    }

    } catch (error) {
      console.log("Error al leer el archivo", error);
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



async updateProduct(id, productoActualizado) {
  try {
      const arrayProductos = await this.readProduct();

      const index = arrayProductos.findIndex(item => item.id === id);

      if (index !== -1) {
          arrayProductos.splice(index, 1, productoActualizado);
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

      const index = arrayProductos.findIndex(item => item.id === id);

      if (index !== -1) {
          arrayProductos.splice(index, 1);
          await this.saveFile(arrayProductos);
          console.log(`El Producto con ID ${id} a sido eliminado`);
      } else {
          console.log("no se encontró el producto");
      }

  } catch (error) {
      console.log("Error al eliminar el producto", error);
  }
}

}

module.exports = ProductManager;