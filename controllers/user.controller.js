import userModel from '../models/user'
import bcrypt from 'bcrypt-nodejs';
import {generateToken} from '../services/token.service';
import mailer from '../services/mailer.service';
import BaseController from "./base.controller";
import taskModel from "../models/task";
import checkTokenValidity from '../services/token.service';
const key = Buffer.from('5ebe2294ecd0e0f08eab7690d2a6ee695ebe2294ecd0e0f08eab7690d2a6ee69', 'hex');
const iv  = Buffer.from('26ae5cc854e36b6bdfca366848dea6bb', 'hex');
import crypto from 'crypto';

class UserController extends BaseController{


    constructor(){
        super(userModel.getModel());
        this.userModel = userModel.getModel();

    }

    //signup user
    signUpUser(user){
        //add defalut role
        user.role = 'admin';
        //hash password
        user.password = this.hashPassword(user.password);
        user.email = this.encrypt(user.email);
        console.log(user.email);
        //create new model
        let userObj = new this.userModel(user);
        //save new model
        return userObj.save();
    }
    //login user
    loginUser(data){
        return new Promise((resolve, reject)=>{
            //get user based on email

            console.log(this.encrypt(data.email));

            this.userModel.findOne({
                email: this.encrypt(data.email)
            }, (err, user)=>{
                if(err) reject(err);
                //if there is no user return false
                if(!user)
                    return reject(false);
                //check if user is not lock
                if(user.lockUntil < new Date()){
                    //check if password is not correct
                    if(this.comparePassword(data.password, user.password)){
                        let token = generateToken(user);
                        let responseToReturn = {
                            token : token,
                            user: user
                        };
                        return resolve(responseToReturn);
                    }else{
                        //add failed login attam
                        this.addFailedLoginAttempt(user).then(()=>{
                            return reject(false);
                        },()=>{
                            return reject(false);
                        });
                    }
                }else{
                    return reject({lock : user.lockUntil.toLocaleString()});
                }


            })
        });
    }
    decryptUsersEmail(users){
        users.forEach((user)=>{
          user.email = this.decrypt(user.email);
        });
        return users;
    }

    addFailedLoginAttempt(user){
        user.loginAttempts+=1;
        if(user.loginAttempts>3){
            let lock =  new Date().setMinutes(new Date().getMinutes()+5);
            user.lockUntil = lock;
            user.loginAttempts = 0;
        }
        return user.save();
    }
    comparePassword(plainPassword, hashedPassword){
        return bcrypt.compareSync(plainPassword, hashedPassword)
    }

    hashPassword(password){
        //salt value
        const saltRounds = 10;
        //generate salt
        let salt = bcrypt.genSaltSync(saltRounds);
        //return hashed password
        return bcrypt.hashSync(password, salt);
    }

    encrypt(email){
        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        var crypted = cipher.update(email,'utf8','hex');
        crypted += cipher.final('hex');
        return crypted;
    }

    decrypt(email){
        var decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
        var decrypted = decipher.update(email,'hex','utf8');
        decrypted += decipher.final('utf8');
        console.log(decrypted, '<--- before return')
        return decrypted;
    }
    generateRecoveryToken() {
        return new Promise((resolve, reject) => {
            crypto.randomBytes((16), (err, buf) => {
                if (err) {
                    reject("problem with token creation");
                } else {
                    resolve(buf.toString('hex'));
                }
            });
        });
    }

    findUser(email) {
        return new Promise((resolve, reject) => {

            this.userModel.findOne({email: email}, (err, user) => {
                if (user) {

                    return resolve(user);
                }
                return reject(err);

            });
        });
    }

    sendEmail(user,token,request){

        var mailOptions = {
            to: user.email,
            from: 'Palkovicova.lucia@gmail.com',
            subject: 'Node.js Password Reset',
            text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + request.headers.host + '/users/reset/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        mailer.sendMail(mailOptions, function(err) {
            console.log('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        });
    }


    sendEmailPasswordChanged(email){
        var mailOptions = {
            to: email,
            from: 'Palkovicova.lucia@gmail.com',
            subject: 'Node.js Password Changed',
            text: 'Your password was changed!!'
        };
        mailer.sendMail(mailOptions, function(err) {
            if(err) console.log(err);
        });
    }


    forgotPassword(request){

        return new Promise((resolve, reject)=> {

            //find if user exists
            this.findUser(this.encrypt(request.body.email)).then((user)=>{

                //generate token
                this.generateRecoveryToken().then((token)=>
                {
                    //save token and expiry of it
                    user.resetPasswordToken = token;
                    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                    //save the user
                    user.save().then((saved)=>
                    {

                        this.sendEmail(user,token,request);
                        return resolve(saved);

                    },(error)=>{
                        return reject(error);
                    });

                },(error)=>{
                    return reject(error);
                });

            },(error)=>{
                return reject(error);
            });


        },(error)=>{
            return reject(error);

        }).catch((error)=>{
                reject(error);
            }
        );


    }

    findUserByToken(req) {

        return new Promise((resolve, reject) => {


            console.log(req);
            //Find the user base on the token
            this.userModel.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }).then((user)=>
            {
                console.log(user);
                return resolve(user);

            },(error)=>
            {
                return reject(error);
            })

            ;
        });

    }


    findUserByEmailInToken(req) {

        return new Promise((resolve, reject) => {


            console.log(req.body.email);
            //Find the user base on the token
            this.userModel.findOne({ email: req.body.email }).then((user)=>
            {
                return resolve(user);

            },(error)=>
            {
                return reject(error);
            })

            ;
        });

    }


    findUserByEmailInToken(email) {


        return new Promise((resolve, reject) => {

            //Find the user base on the token
            this.userModel.findOne({ email: email}).then((user)=>
            {
                return resolve(user);

            },(error)=>
            {
                return reject(error);
            })

            ;
        });
    }

    setNewPassword(req){

        return new Promise((resolve, reject) => {

            //find the users based on the token
            this.findUserByToken(req).then((user)=>{

                //hash the new password
                user.password = this.hashPassword(req.body.password);
                user.email = this.encrypt(user.email);
                //set the reset token back to undefined
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;

                //save user changes
                user.save().then(saved => {
                    this.sendEmailPasswordChanged(user.email)
                    return resolve(user);

                },(error=>{
                    return reject(error);
                }));


            },(error=>{
                return reject(error);
            }));

        });

    }

}
const userController = new UserController();
export default userController;