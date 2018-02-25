import express from 'express';
import userController from '../controllers/user.controller';
import {validateCaptcha} from '../services/captcha.service';
//define router
let userRouter = express.Router();

/**
 * @swagger
 * definitions:
 *  User:
 *      type: object
 *      required:
 *      - email
 *      - password
 *      properties:
 *          companyName:
 *              type: string
 *          email:
 *              type: string
 *          password:
 *              type: string
 */

/**
 * @swagger
 * /users:
 *  get:
 *      tags:
 *      - user
 *      summary: get all users
 *      description: get all users
 *      responses:
 *          201:
 *              description: ok
 *
 */
userRouter.get('/', function(req, res) {
    userController.getUsers().then((err, users)=>{
        if(err)
            console.error(err);
        res.json({users: users });
    });
});
/**
 * @swagger
 * /users/signup:
 *  post:
 *      tags:
 *      - user
 *      summary: create user with captcha validation
 *      description: create user in prod
 *      parameters:
 *      - in: body
 *        name: user
 *        schema:
 *           $ref: '#/definitions/User'
 *      - in: body
 *        name: captcha
 *        schema:
 *           type: string
 *      responses:
 *          201:
 *              description: ok
 *
 */
userRouter.post('/signup', validateCaptcha, (req, res)=> {
    userController.signUpUser(req.body).then((created, err)=>{
        if(err)
            res.status(400).send(err);
        res.send(created);
    }).catch((e)=>{
        res.status(400).send(e.errmsg);
    });
});

/**
 * @swagger
 * /users/login/{email}/{password}:
 *  get:
 *      tags:
 *      - user
 *      summary: login user
 *      description: login user
 *      parameters:
 *      - in: path
 *        name: email
 *        schema:
 *           type: string
 *      - in: path
 *        name: password
 *        schema:
 *           type: string
 *      responses:
 *          201:
 *              description: ok
 *
 */
userRouter.get('/login/:email/:password', (req, res)=>{
    userController.loginUser(req.params).then((data)=>{
        res.json({
            success: true,
            message: 'Enjoy your token!',
            token: data
        });

    }, (err)=>{
        res.status(404).send('email or password is incorrect ');
    })
});

export default userRouter;