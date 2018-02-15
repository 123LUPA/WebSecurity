var express = require('express');
var router = express.Router();
var User = require('../models/user');
var config = require('../config');

router.get('/all', function(req, res) {
    User.find({}, function(err, users) {
        res.json(users);
    });
});


module.exports = router;
