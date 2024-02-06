import express from "express";
import productsRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.routes.js";
import hdsRouter from "./routes/handlebars.routes.js"
import exphbs from "express-handlebars";
import __dirname from "./utils.js";
import * as path from "path";
import ProductManager from "./dao/db/product-manager-db.js";
import connectMongoose from "./dao/db/database.js";

const app = express();
const PORT = 8080;
connectMongoose;
const productManager = new ProductManager();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", express.static(__dirname + "/public"));


app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname + "/views"));


app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", hdsRouter);

app.listen(PORT, () => {
  console.log(`Escuchando en http://localhost:${PORT}`);
})



