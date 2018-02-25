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
                console.log(err, user, data.email);
                if(err) reject(err);
                //if there is no user return false
                if(!user)
                    return reject(false);
                //check if password is not correct
                if(this.comparePassword(data.password, user.password))
                    return resolve(generateToken(user));

            })
        });


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