import jwt from 'jsonwebtoken';

export function generateToken(user) {
    const payload = {
        //todo add roles
        email: user.email
    };
    //time can be easly change
    return jwt.sign(payload, 'superDuperSecretKey',  { expiresIn: '1h' });
}