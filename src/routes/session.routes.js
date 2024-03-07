import express from "express";
import UserModel from "../dao/models/user.models.js";
import { isValidPassword } from "../utils.js";
import passport from "passport";

const router = express.Router();

/*router.post("/login", async(req,res)=>{
    const {email, password} = req.body;
    try {
        const user = await UserModel.findOne({email: email});
        if (user){
            //if (user.password === password){
                if (isValidPassword(password, user)) {
                req.session.login = true;
                req.session.user = {
                    email: user.email,
                    age: user.age,
                    first_name: user.first_name,
                    last_name: user.last_name,
                };
                return res.redirect("/api/products");
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
*/

router.post("/login", passport.authenticate("login", { failureRedirect: "/faillogin" }), 
async (req,res) => {
    if (!req.user) return res.status(400).send({ status: "error", message: "credenciales invalidas" });
    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email
    }
    req.session.login = true;
    res.redirect("/api/products");
});

router.get("/faillogin", async (req, res) => {
    console.log("Fallo de autenticacion");
    res.send({ error: "Fallo Total" });
})


router.get("/logout", (req, res) => {
    if (req.session.login) {
        req.session.destroy();
    }
    res.redirect("/api/view/login")
});


router.get("/github", passport.authenticate("github",{scope:["user:email"]}),async(req,res)=>{

})

router.get("/githubcallback", passport.authenticate("github",{failureRedirect:"/login"}), async(req,res)=>{
    req.session.user = req.user;
    req.session.login = true;
    res.redirect("/api/view/profile")
})

export default router;