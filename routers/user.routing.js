import express from 'express';
import userController from '../controllers/user.controller';
import {validateCaptcha} from '../services/captcha.service';
import {checkTokenValidity} from "../services/token.service";;
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
 * definitions:
 *  Login:
 *      type: object
 *      required:
 *      - email
 *      - password
 *      properties:
 *          email:
 *              type: string
 *          password:
 *              type: string
 */


/**
 * @swagger
 * definitions:
 *  PasswordReset:
 *      type: object
 *      required:
 *      - email
 *      properties:
 *          email:
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
    userController.getAll().then((users, err)=>{
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
    userController.signUpUser(req.body)/*.then((created, err)=>{
        if(err)
            res.status(400).send(err);
        res.send(created);
    }).catch((e)=>{
        res.status(400).send(e.errmsg);
    });*/
});

/**
 * @swagger
 * /users/signupDev:
 *  post:
 *      tags:
 *      - user
 *      summary: create user ONLY DEV!
 *      description: create user without captcha (ONLY IN DEV)
 *      parameters:
 *      - in: body
 *        name: user
 *        schema:
 *           $ref: '#/definitions/User'
 *      responses:
 *          201:
 *              description: ok
 *
 */
userRouter.post('/signupDev', (req, res)=> {
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
 * /users/{userId}:
 *  delete:
 *      tags:
 *      - user
 *      summary: delete user by id
 *      description: delete specific user based on id
 *      parameters:
 *      - in: path
 *        name: userId
 *        schema:
 *          type: string
 *      - in: header
 *        name: X-Access-Token
 *        schema:
 *          type: string
 *      responses:
 *          200:
 *              description: ok
 */
userRouter.delete('/:userId', checkTokenValidity, function (req, res) {
    userController.delete_oneUser(req.params.userId).then((deleted, err) => {
        console.log(err, "<-- here");
        res.send(deleted);
    }, err => {
        res.status(400).send(err);

    });
});

//this should be CHANGED after implementing admin roles (it's just for cleaning up without token)
/**
 * @swagger
 * /users/dev/{userId}:
 *  delete:
 *      tags:
 *      - user
 *      summary: delete user by id -- NO TOKEN REQUIRED
 *      description: delete specific user based on id -- NO TOKEN REQUIRED
 *      parameters:
 *      - in: path
 *        name: userId
 *        schema:
 *          type: string
 *      responses:
 *          200:
 *              description: ok
 */
//this should be CHANGED after implementing admin roles
userRouter.delete('/dev/:userId', function (req, res) {
    userController.delete_oneUser(req.params.userId).then((deleted, err) => {
        console.log(err, "<-- here");
        res.send(deleted);
    }, err => {
        res.status(400).send(err);
    });
});

/**
 * @swagger
 * /users/login:
 *  post:
 *      tags:
 *      - user
 *      summary: Login with token creation
 *      description: Login the user
 *      parameters:
 *      - in: body
 *        name: login
 *        schema:
 *           $ref: '#/definitions/Login'
 *      responses:
 *          201:
 *              description: ok
 *
 */

userRouter.post('/login', (req, res)=>{
    userController.loginUser(req.body).then((data)=>{
        res.json({
            success: true,
            message: 'Enjoy your token!',
            token: data.token,
            user: data.user
        });

    }, (err)=>{
        if(err.lock){
            return res.json({ success: false, message: 'Locked until:' + err.lock});
        }
        res.status(404).send('email or password is incorrect ');
    })
});

/**
 * @swagger
 * /users/update:
 *  put:
 *      tags:
 *      - user
 *      summary: update user data
 *      description: edit user data based on userid and token
 *      parameters:
 *      - in: header
 *        name: X-Access-Token
 *        schema:
 *      - in: body
 *        name: user
 *        schema:
 *           $ref: '#/definitions/User'
 *      responses:
 *          200:
 *              description: ok
 *
 */
userRouter.put('/update',checkTokenValidity, function (req, res) {
    userController.updateUserData(req.user._id, req.body).then((updated, err)=>{
        if(err)
            res.status(400).send(err);
        res.send(updated);
    }).catch((e)=>{
        res.status(400).send(e.errmsg);
    });
});

/**
 * @swagger
 * /users/forgot:
 *  post:
 *      tags:
 *      - user
 *      summary: Insert email associated with forgotten password
 *      description: Password Reset
 *      parameters:
 *      - in: body
 *        name: email
 *        schema:
 *           $ref: '#/definitions/PasswordReset'
 *      responses:
 *          201:
 *              description: ok
 *
 */

//Rout that checks if the user exists & send email with password reset
userRouter.post('/forgot', (req, res)=>{

    console.log("here");
    userController.forgotPassword(req).then((data)=>{

        res.send(data);

    }).catch(err=>{
        res.sendStatus(500);
    })
});


//Link from the email checks if the user who wanted to change the password exists and the token is not expired
userRouter.get('/reset/:token', function (req, res) {
    userController.findUserByToken(req).then((user) => {
        if (!user) {
            //If user does not exist navigate to forgot password form
            return res.redirect('http://localhost:4200/#/forgot');
        }
        //else navigate to rest form where user can type new password
        return res.redirect('http://' + 'localhost:4200/#' + '/reset/' + req.params.token);
    });
});

//Submmit new password
userRouter.post('/reset/:token', function (req, res) {
    userController.setNewPassword(req).then((data) => {
        if (!data) {
            res.sendStatus(500);
        }
        res.send(data);
    })
});


export default userRouter;