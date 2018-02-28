import userModel from '../models/user'
import bcrypt from 'bcrypt-nodejs';
import {generateToken} from '../services/token.service';
import crypto from 'crypto';
import mailer from '../services/mailer.service';

class UserController{


    constructor(){
        this.userModel = userModel.getModel();
    }
    //get all users
    getUsers(){
        return this.userModel.find({});
    }
    //signup user
    signUpUser(user){
        //hash password
        user.password = this.hashPassword(user.password);
        //create new model
        let userObj = new this.userModel(user);
        //save new model
        return userObj.save();
    }
    //login user
    loginUser(data){
        return new Promise((resolve, reject)=>{
            //get user based on email
            this.userModel.findOne({
                email: data.email
            }, (err, user)=>{
                if(err) reject(err);
                //if there is no user return false
                if(!user)
                    return reject(false);
                //check if user is not lock
                if(user.lockUntil < new Date()){
                    //check if password is not correct
                    if(this.comparePassword(data.password, user.password)){
                        return resolve(generateToken(user));
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

            this.getUsers().findOne({email: email}, (err, user) => {
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
                this.findUser(request.body.email).then((user)=>{

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


            //Find the user base on the token
            this.getUsers().findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }).then((user)=>
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