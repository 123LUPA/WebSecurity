import userModel from '../models/user'
import bcrypt from 'bcrypt-nodejs';
import {generateToken} from '../services/token.service';
import crypto from 'crypto';
import mailer from '../services/mailer.service';
import BaseController from "./base.controller";
const key = Buffer.from('5ebe2294ecd0e0f08eab7690d2a6ee695ebe2294ecd0e0f08eab7690d2a6ee69', 'hex');
const iv  = Buffer.from('26ae5cc854e36b6bdfca366848dea6bb', 'hex');


class UserController extends BaseController{
    constructor(){
        super(userModel.getModel());
        this.userModel = userModel.getModel();
    }
    //signup user
    signUpUser(user){
        //check for validation before allow signup
        return new Promise((resolve, reject)=> {
            if (this.companyNameValidator(user.companyName)&&
                this.passwordValidation(user.password)&&
                this.emailValidation(user.email)) {
                //hash password
                user.password = this.hashPassword(user.password);
                user.email = this.encrypt(user.email);
                //create new model
                let userObj = new this.userModel(user);
                //save new model
                return userObj.save();
            }else{
                return reject(error);
            }
        });
    }
    //login user
    loginUser(data){
        return new Promise((resolve, reject)=>{
            //get user based on email
            console.log(this.encrypt(data.email));
            this.userModel.findOne({email: this.encrypt(data.email)}, (err, user)=>{
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
                        //add failed login attempt
                        this.addFailedLoginAttempt(user).then(()=>{
                            return reject(false);
                        },()=>{
                            return reject(false);
                        });
                    }
                }else{
                    return reject({lock : user.lockUntil.toLocaleString()});
                }

            });
        });
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
        var decipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        var decrypted = decipher.update(email,'hex','utf8');
        decrypted += decipher.final('utf8');
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
    /*
      updateUserData takes two parameters:
       - user_id : which is the user db id
       - newUser_body : which is the new data for email, password and companyName
      first find the user to be updated, if the user is in the database then go through validations of newUser_body
      if validation of newUser_body doesn't pass, the old user data will not be changed with the new one - this doesn't trigger error
       //TO DO:
        - implement validation in frontend for user update data fields
     */
    updateUserData(user_id, newUser_body){
        console.log('The user id parsed in updateUserData in user.controller.js is: ', user_id, ' and body is: ', newUser_body);
        return new Promise((resolve, reject) => {
            //find the user to be updated based on email
            return this.userModel.findById(user_id,(err, user) => {
                if(err)
                    return reject(err);
                let finalUser = user;
                if(newUser_body.email!=null && this.emailValidation(newUser_body.email)){
                    //encrypt the new email
                    newUser_body.email = this.encrypt(newUser_body.email);
                    finalUser.email = newUser_body.email;
                }
                if(newUser_body.password!=null && this.passwordValidation(newUser_body.password)){
                    //hash the new password
                    newUser_body.password = this.hashPassword(newUser_body.password);
                    finalUser.password = newUser_body.password;
                }
                if(newUser_body.companyName!=null && this.companyNameValidator(newUser_body.companyName)){
                    finalUser.companyName = newUser_body.companyName;
                }
                return user.update(finalUser).then((updated, err)=>{
                    if(err)
                        reject(err);
                    resolve(updated);
                });

            });
        });

    }
    delete_oneUser(id){
        //create promise
        return new Promise((resolve, reject) => {
            //get task which we want to delete
            this.userModel.findById(id, (err, obj)=>{
                if(err || obj === null){
                    reject(err);
                }else{
                    this.userModel.remove({_id: id}).then((deleted, err)=>{
                        if(err)
                            reject(err);
                        resolve(deleted);
                    });
                }
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
            this.findUser(request.body.email).then((user)=>{
                //generate token
                this.generateRecoveryToken().then((token)=> {
                    //save token and expiry of it
                    user.resetPasswordToken = token;
                    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
                    //save the user
                    user.save().then((saved)=> {
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
        });

    }

    findUserByToken(req) {
        return new Promise((resolve, reject) => {
            console.log(req);
            //Find the user base on the token
            this.userModel.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now()}})
                .then((user)=> {
                    console.log(user);
                    return resolve(user);
                },(error)=> {
                    return reject(error);
                });
        });
    }


    findUserByEmailInToken(req) {
        return new Promise((resolve, reject) => {
            console.log(req.body.email);
            //Find the user base on the token
            this.userModel.findOne({ email: req.body.email }).then((user)=>{
                return resolve(user);
            },(error)=>{
                return reject(error);
            });
        });
    }


    findUserByEmailInToken(email) {
        return new Promise((resolve, reject) => {
            //Find the user base on the token
            this.userModel.findOne({ email: email}).then((user)=> {
                return resolve(user);
            },(error)=>{
                return reject(error);
            });
        });
    }

    setNewPassword(req){
        return new Promise((resolve, reject) => {
            //find the users based on the token
            this.findUserByToken(req).then((user)=>{
                //hash the new password
                user.password = this.hashPassword(req.body.password);
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

    /* validation functions:
    * emailValidation: must contain letters, numbers, characters ._+@ case insensitive and min 5 characters
    * companyNameValidation: must contain only letters and numbers, case insensitive, min 2 characters
    * passwordValidation: can contain only characters !_.,* letters, numbers, case insensitive, min 6 characters
    */
    emailValidation(email){
        const regEx_email = new RegExp(/^[a-zA-Z0-9._+]+@[a-z]+\.[a-z.]{2,5}$/);
        return (regEx_email.test(email));
    }
    companyNameValidator(companyTitle){
        const regEx_title = new RegExp(/^[a-zA-Z0-9]{2,}$/);
        return (regEx_title.test(companyTitle));
    }
    passwordValidation(userPass){
        const regEx_pass = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,}$/);
        return (regEx_pass.test(userPass));
    }
}



const userController = new UserController();
export default userController;