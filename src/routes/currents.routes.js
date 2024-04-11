import passport from "passport"
import express from "express";
import { authorization, passportCall } from "../config/passport.config.js";

const router = express.Router();


/*router.get("/", passport.authenticate("jwt", { session: false }), (req, res) => {
    res.send(req.user);
}
)*/

router.get("/", passportCall("jwt"), authorization("user"), (req, res) => {
    res.send(req.user);
}
)

export default router;