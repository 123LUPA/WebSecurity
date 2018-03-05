import jwt from 'jsonwebtoken';
import userController from '../controllers/user.controller';

export function checkTokenValidity(req,res,next) {

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, ('superDuperSecretKey'), function (err, decoded) {
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
                return res.send(err);
            });
        });

    } else {
        return res.status(403)
    }

}

export function generateToken(user) {
    const payload = {
        //todo add roles
        email: user.email
    };
    //time can be easly change
    return jwt.sign(payload, 'superDuperSecretKey',  { expiresIn: Date.now()+5000 });
}