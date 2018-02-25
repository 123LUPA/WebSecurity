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




router.post('/forgot',function (req,res,next) {

    async.waterfall([
        function(done) {
            crypto.randomBytes(20, function(err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function(token, done) {
            User.findOne({ email: req.body.email }, function(err, user) {
                if (!user) {
                    console.log('error', 'No account with that email address exists.');
                }

                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                user.save(function(err) {
                    done(err, token, user);
                    res.status(200).send({text: 'all was done'});

                });


            });
        },
        function(token, user, done) {
            var smtpTransport = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                auth: {
                    user: 'rlpveprc34b6yehh@ethereal.email',
                    pass: 'NEbuhrJmQmxba8CBSu'
                }
            });


            var mailOptions = {
                to: user.email,
                from: 'Palkovicova.lucia@gmail.com',
                subject: 'Node.js Password Reset',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            smtpTransport.sendMail(mailOptions, function(err) {
                console.log('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
                done(err,'done');
            });
        }
    ], function(err) {
        if (err) { return next(err); }
    })
});

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
