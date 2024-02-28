import express from "express";
import UserModel from "../dao/models/user.models.js";
//import isValidPassword from "../utils/hashBcrypt.js";

const router = express.Router();

router.post("/login", async(req,res)=>{
    const {email, password} = req.body;
    try {
        const user = await UserModel.findOne({email: email});
        if (user){
            if (user.password === password){
                req.session.login = true;
                req.session.user = {
                    email: user.email,
                    age: user.age,
                    first_name: user.first_name,
                    last_name: user.last_name,
                };
                res.redirect("/api/products");
            } else {
                res.status(401).send({message: "Password incorrecto"});
            }
        }else{
            res.status(404).send({message:"Usuario no encontrado"});
        }
    } catch (error) {
        res.status(400).send({message: "Error al loguearse"});
    }
})

router.get("/logout", (req,res)=>{
    if(req.session.login){
        req.session.destroy();
    } 
    res.redirect("/api/view/login")
});

export default router;