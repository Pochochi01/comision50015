import express from "express";
import productsRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.routes.js";
import hdsRouter from "./routes/handlebars.routes.js"
import exphbs from "express-handlebars";
import __dirname from "./utils.js";
import * as path from "path";
import { Server } from "socket.io";
import ProductManager from "./controllers/product-manager.js";

const app = express();
const PORT = 8080;
const productManager = new ProductManager("./src/models/products.json");


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", express.static(__dirname + "/public"));


app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname + "/views"));


app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", hdsRouter);


const server = app.listen(PORT, () => {
  console.log(`Escuchando en http://localhost:${PORT}`);
})

const io = new Server(server);

io.on("connection", async (socket) => {
  console.log("Cliente Conectado")
  socket.emit("productos", await productManager.readProduct());

  socket.on("eliminarProducto", async (id) => {
    await productManager.deleteProductById(id);
    io.sockets.emit("productos", await productManager.getProducts());
  })

  socket.on("agregarProducto", async (producto) => {
    await productManager.addProduct(producto);
    io.sockets.emit("productos", await productManager.getProducts());
  })

});


