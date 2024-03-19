import  express  from "express";
import UserModel from "../dao/models/user.models.js";
import { createHash } from "../utils.js";
import passport from "passport";
import generateToken from "../utils/jsonWebToken.js";


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


//Version para Passport
/*
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
})*/

/// Registro(login) con Json Web Token
router.post("/", async (req,res)=>{
    const {first_name, last_name, email, password, age} = req.body;
try {
    const userExist = await UserModel.findOne({email:email});
    if (userExist){
        return res.status(400).send({status:"error", message: "el email ya esta registrado"})
    } 
        const newUser = await UserModel.create({first_name, last_name, email, password: createHash(password), age});
        const token = generateToken({id: newUser._id,});
        res.status(200).send({status: "succes",message: "Usuario Creado Correctamente", token});
    
} catch (error) {
    console.log("error en la autenticacion", error);
    res.status(500).send({status: "error", message: "error interno en el servidor"});
}

})

export default router;