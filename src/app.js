const express = require("express");
const PORT = 8080;
const ProductManager = require("./product-manager.js");
const manager = new ProductManager("./src/products.json");


const app = express();
app.use(express.urlencoded({ extended: true }));

const readProducts = manager.readProduct();

app.get("/",  (req, res) => {
  res.send("");
})


app.get("/products", async (req, res) => {
 try {
  let limit = parseInt(req.query.limit);
  const arrayProductos = await manager.readProduct();
  if (limit >= 0 && limit < arrayProductos.length){
    const result = arrayProductos.slice(0,limit);
    return res.send(result);
  } else {
   // return res.send({error: "limite ingresado fuera de rango del arreglo"});
    return res.send(arrayProductos);
  }

  }  catch (error){
     console.log(error);
     res.send("Error al procesar la solicitud");
   }
});


app.get("/products/:pid", async (req, res) => {
  try {
    let pid = parseInt(req.params.pid);
    const productById = await manager.getProductById(pid);
    if (productById) {
      return res.send(productById);
    } else {
      return res.send(productById);
    }
  }
  catch (error) {
    console.log(error);
    res.send("Error al Cargar");
  }

});

app.listen(PORT, () => {
  console.log(`Escuchando en http://localhost:${PORT}`);
})