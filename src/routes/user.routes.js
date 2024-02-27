import  express  from "express";
import UserModel from "../dao/models/user.models.js";
//import createHash from "../utils/hashBcrypt.js"


const router = express.Router();

router.post("/login",async(req,res)=>{
    const {first_name, last_name, email, password, age} = req.body;
    try {
        const existUser = await UserModel.findOne({email: email});
        console.log(existUser);
        if (existUser){
            console.log(1)
            return res.status(400).send({message: "Email ya registrado"})
        }
        const newUser = await UserModel.create({first_name, last_name, email, password, age});
        console.log(2)
        req.session.login = true;
        req.session.user = {...newUser._doc};
        res.status(200).send({message: "Usuario Creado Correctamente"});
        
    } catch (error) {
        res.status(400).send({message: "Error al crear el Usuario"})
    }
})

router.get("/users", (req,res)=>{
    if (req.session.userLogin) {
        return res.send(`El Usuario conectado es: ${req.session.userLogin}`)
    } else {
        return res.send("No hay usuarios activos")
    }
})

export default router;