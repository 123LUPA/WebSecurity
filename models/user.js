/**
 * Created by Palko on 29/01/2018.
 */
import db from '../database/databaseConnection';

class UserModel{
    constructor(){
        this.mongoose = db.getMongoose();
        this.Schema = this.mongoose.Schema;
        this.createSchema();
        this.userModel = this.mongoose.model('User', this.userSchema);

    }
    createSchema(){
        this.userSchema = new this.Schema({
            companyName: {
                type: String
            },
            email: {
                type: String,
                required: true,
                unique: true
            },
            password: {
                type:String,
                required: true
            },
            resetPasswordToken: {
                type: String
            },
            resetPasswordExpires: {
                type: Date
            },
            loginAttempts: {
                type: Number,
                default: 0
            },
            startTime: {
                type: Date, index: true
            },
            endTime: {
                type: Date
            }
        }, {versionKey: false})
    }
}
const userModel =  new UserModel().userModel;

export default userModel;



// var  mongoose = require('mongoose');
// var Schema = mongoose.Schema;
// var isodate = new Date();
//
// module.exports = mongoose.model('User',new Schema({
//     companyName: {type:String,required: true},
//     email: {type:String,required: true, unique: true},
//     password: {type:String,required: true},
//     resetPasswordToken: String,
//     resetPasswordExpires: Date,
//     loginAttempts: {type:Number, default:0},
//     lockUntil: {type:Date, default:isodate},
//
// }));