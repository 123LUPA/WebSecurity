import jwt from 'jsonwebtoken';
import userController from '../controllers/user.controller';

let client='http://localhost:4200';
import * as fs from "fs";
const PRIVATE_KEY = fs.readFileSync('./private.key');

export function checkTokenValidity(req,res,next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];


    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, (PRIVATE_KEY), function (err, decoded) {

            console.log("DECODED" + decoded.exp);
            if (err) {
                return res.status(400).send("Failed to authenticate token.");


            } else if (decoded.exp <= Date.now()) {

                return res.status(498).send('Access token has expired');

            }
            userController.findUserByEmailInToken(decoded.email).then((user)=>{
                if(!user){
                    return res.status(404).send("User not found");
                }
                req.user = user;

                next();
            },(err)=>{
                 res.send(err);
            });
        });

    } else {
        res.sendStatus(403);
    }

}

 function checkRefererAndOrigin(req){

     if(req.headers['referer'] == client+"/" && req.headers['origin'] == client){
         return true;
     }
    return false;
}

export function generateToken(user) {
    const payload = {
        email: user.email,
    };
    return jwt.sign(payload,PRIVATE_KEY, { expiresIn: Date.now()+5000 });
}
