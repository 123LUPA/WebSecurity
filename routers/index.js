import express from 'express';

let router = express.Router();
var User = require('../models/user');
var jwt = require('jsonwebtoken');
var config = require('../config');
var bcrypt = require('bcrypt');
var session = require('express-session')
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');
var async = require('async');
var crypto = require('crypto');
var request = require('request');

const saltRounds = 10;





router.get('/reset/:token', function(req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
            console.log('error', 'Password reset token is invalid or has expired.');
            return res.redirect('http://localhost:4200/#/forgot');
        }

        return res.redirect('http://' + 'localhost:4200/#' + '/reset/'+ req.params.token);
    });
});

router.post('/reset/:token', function(req, res) {
    async.waterfall([
        function(done) {
            User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
                if (!user) {
                    console.log('error', 'Password reset token is invalid or has expired.');
                    return res.redirect('http://localhost:4200/#/forgot');
                }

                var salt = bcrypt.genSaltSync(saltRounds);
                var hashedPassword = bcrypt.hashSync(req.body.password, salt);

                user.password = hashedPassword;
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;

                user.save(function(err) {
                    if (err) throw err;

                    console.log('User saved successfully');
                    res.json({ success: true });
                });
            });
        },
    ], function(err) {
        res.redirect('http://localhost:4200');
    });
});


module.exports = router;
