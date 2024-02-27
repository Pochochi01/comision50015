import express from "express";
import session from "express-session";
import productsRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.routes.js";
import userRouter from "./routes/user.routes.js"
import hdsRouter from "./routes/handlebars.routes.js";
import viewRouter from "./routes/view.routes.js";
import sessionRouter from "./routes/session.routes.js"
import exphbs from "express-handlebars";
import __dirname from "./utils.js";
import * as path from "path";
import MessageModel from "./dao/models/message.models.js";
import connectMongoose from "./dao/db/database.js";
//import  { socket }  from "socket.io";
import cookieParser from "cookie-parser";
import mongoStore from "connect-mongo";


const app = express();
const PORT = 8080;
connectMongoose;
//const productManager = new ProductManager();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret:"JatSport",
  resave: true,
  saveUninitialized:true,
  store: mongoStore.create({
    mongoUrl: "mongodb+srv://largomauroandres:Susana11@cluster0.fsbbh9v.mongodb.net/e-commerce?retryWrites=true&w=majority",
    ttl: 250
})
}))
app.use("/", express.static(__dirname + "/public"));

const hbs = exphbs.create({
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  }
})


app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname + "/views"));


app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/view", viewRouter);
app.use("/users", userRouter);
app.use("/session", sessionRouter);


app.listen(PORT, () => {
  console.log(`Escuchando en http://localhost:${PORT}`);
})

/* Chat opcional para el trabajo

const io = new socket.Server(httpServer);


io.on("conection", (socket) => {
  console.log("Nuevo Usuario Conectado")
  socket.on("message", async data => {
    await MessageModel.create(data);
    const messages = await MessageModel.find();
    io.socket.emit("message", messages);
  })
})*/