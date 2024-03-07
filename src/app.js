import express from "express";
import session from "express-session";
import productsRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.routes.js";
import userRouter from "./routes/user.routes.js"
import viewRouter from "./routes/view.routes.js";
import sessionRouter from "./routes/session.routes.js"
import exphbs from "express-handlebars";
import __dirname from "./utils.js";
import * as path from "path";
import connectMongoose from "./dao/db/database.js";
import cookieParser from "cookie-parser";
import mongoStore from "connect-mongo";
import initializePassport from "./config/passport.config.js";
import passport from "passport";


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
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

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
app.use("/api/view", viewRouter);
app.use("/api/users", userRouter);
app.use("/api/session", sessionRouter);


app.listen(PORT, () => {
  console.log(`Escuchando en http://localhost:${PORT}`);
})

