import jwt from "jsonwebtoken";

const private_key = "secretToken";

const generateToken = (user) => {
    const token = jwt.sign(user ,private_key,{expiresIn:"24h"});
    //
    //send({message:"login exitoso"});

    return token;
}

export default generateToken;