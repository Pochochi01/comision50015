import passport from "passport";
import passportLocal from "passport-local"
import userModel from "../dao/models/user.models.js";
import { createHash, isValidPassword } from "../utils.js";
import passportGithub from "passport-github2";
import  jwt  from "passport-jwt";


const localStrategy = passportLocal.Strategy;
const JWTStrategy = jwt.Strategy;
const extractJWT = jwt.ExtractJwt;

const initializePassport = () => {
    passport.use("register", new localStrategy({
        passReqToCallback: true,
        usernameField: "email"

    }, async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {
            let user = await userModel.findOne({ email });
            if (user) return done(null, false);
            let newUser = {
                first_name,
                last_name,
                email,
                password: createHash(password),
                age
            }
            let result = await userModel.create(newUser);
            //poner un if para ver si creo bien el nuevo usuario
            return done(null, result);
        } catch (error) {
            return done(error);
        }
    }))

    passport.use("login", new localStrategy({
        usernameField: "email"
    }, async (email, password, done) => {
        try {
            let user = await userModel.findOne({ email });
            if (!user) {
                console.log("usuario inexistente");
                return done(null, false);
            } else {
                if (!isValidPassword(password, user)) return done(null, false);
                return done(null, user);
            }
        } catch (error) {
            return done(error);
        }
    }
    ))

    passport.serializeUser((user, done) => {
        done(null, user._id);
    })

    passport.deserializeUser(async (id, done) => {
        let user = userModel.findById({ _id: id });
        done(null, user);
    })

    passport.use("github", new passportGithub({
        clientID: "Iv1.99a9a89afbadb19b",
        clientSecret: "076f8f86214d221e4aebcd91511a1230b48855bf",
        callbackURL: "http://localhost:8080/api/session/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await userModel.findOne({ email: profile._json.email });
            if (!user) {
                let newUser = {
                    first_name: profile._json.name,
                    last_name: "",
                    age: 18,
                    email: profile._json.email,
                    password: ""
                }
                let result = await userModel.create(newUser);
                done(null, result);
            } else {
                done(null, user);
            }

        } catch (error) {
            return done(error)
        }
    }))

    passport.use("jwt", new JWTStrategy({
        jwtFromRequest: extractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: "secretToken",
    }, async (jwt_payLoad, done)=>{
        try {
            return done(null, jwt_payLoad);
        } catch (error) {
            return done(error);
        }
    })
    )



}

const cookieExtractor = req => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies["cookieOne"]
    }
    return token;
}

export const passportCall = (strategy) => {
    return async (req,res,next)=>{
        passport.authenticate(strategy,(error, user, info)=>{
            if (error)
                return next(error);
            if (!user){
                res.status(401).send({error: info.message ? info.message : info.toString()})
            }
            req.user = user;
            next();
        })(req,res,next);
    }
}

export const authorization = (role) =>{
    return async (req,res,next)=>{
        if(req.user.role !== role){
            return res.status(403).send({message:"Usuario no autorizado"});
        }
        next();
    }
}

export default initializePassport;
