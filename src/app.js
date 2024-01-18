import express from "express";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import hdsRouter from "./routes/handlebars.router.js"
import exphbs from "express-handlebars";
import __dirname from "./utils.js";
import * as path from "path";
import {Server} from "socket.io";
import ProductManager from "./controllers/product-manager.js";

const app = express();
const PORT = 8080;
const productManager = new ProductManager("./src/models/products.json");


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", express.static(__dirname + "/public"));


app.engine("handlebars",exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname + "/views"));


app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", hdsRouter);


const server = app.listen(PORT, () => {
  console.log(`Escuchando en http://localhost:${PORT}`);
})

const io = new Server(server);

io.on("connection", async(socket) =>{
  console.log("Cliente Conectado")
  socket.emit("productos", await productManager.readProduct());
  
  socket.on("elimiarProducto", async (id)=>{
    console.log(id)
    await productManager.deleteProductById(id);
    io.socket.emit("productos", await productManager.getProducts());
  })

  socket.on("agregarProducto", async (producto)=>{
    await productManager.addProduct(producto);
    io.socket.emit("productos", await productManager.getProducts());
  })

});


