import  express  from "express";
import UserModel from "../dao/models/user.models.js";
import { createHash } from "../utils.js";
import passport from "passport";


const router = express.Router();
/*
router.post("/login",async(req,res)=>{
    const {first_name, last_name, email, password, age} = req.body;
    try {
        const existUser = await UserModel.findOne({email: email});
        console.log(existUser);
        if (existUser){
            return res.status(400).send({message: "Email ya registrado"})
        }
        const newUser = await UserModel.create({first_name, last_name, email, password:createHash(password), age});
        req.session.login = true;
        req.session.user = {...newUser._doc};
        res.status(200).send({message: "Usuario Creado Correctamente"});
        
    } catch (error) {
        res.status(400).send({message: "Error al crear el Usuario"})
    }
})

router.get("/users", (req,res)=>{
    if (req.session.user) {
        return res.send(`El Usuario conectado es: ${req.session.user}`)
    } else {
        return res.send("No hay usuarios activos")
    }
})
*/

router.post("/login", passport.authenticate("register", { failureRedirect: "/failregister"}), async(req,res)=>{
    if (!req.user)
    return res.status(400).send({status: error, message: "Credenciales Invalidas"});
    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email
    }
    req.session.login = true;
    res.redirect("api/view/login");
})

router.get("/failregister", (req,res)=>{
    res.send({error: "Registro Fallido"})
})

export default router;