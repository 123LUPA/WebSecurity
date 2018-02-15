/**
 * Created by Palko on 29/01/2018.
 */

var  mongoose = require('mongoose');
var Schema = mongoose.Schema;
var isodate = new Date();

module.exports = mongoose.model('User',new Schema({
    companyName: {type:String,required: true},
    email: {type:String,required: true, unique: true},
    password: {type:String,required: true},
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    loginAttempts: {type:Number, default:0},
    lockUntil: {type:Date, default:isodate},

}));