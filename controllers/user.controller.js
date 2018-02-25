import userModel from '../models/user'
import bcrypt from 'bcrypt-nodejs';
import {generateToken} from '../services/token.service';

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
        if(user.loginAttempts>=3){
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
}
const userController = new UserController();
export default userController;