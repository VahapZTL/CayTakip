var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');

var Surgun = mongoose.model('Surgun');

var config = require('../config/config');


//Login Router
router.post('/login', function(req, res) {

});

//Register Router
router.post('/register', function (req, res) {

});

//Authorization Function
isAuth = function (req, res, next) {
    //Coming token from headers
    var comingToken = req.headers["authorization"];

    //if(typeof comingToken !== 'undefined')
    if(comingToken){
        //Split header block to token type and token data
        var header = comingToken.split(" ");
        //Token data in accessToken variable
        var accessToken = header[1];
        jwt.verify(accessToken, config.Secret, function (err, decoded) {
            if(err){
                res.json({
                    success: false,
                    data: 'Token bilgisinde hata var!'
                });
            }else{
                req.decoded = decoded;
                next();
            }
        });
    }else{
        res.status(403).json({
            success: false,
            data: 'Herhangi bir token bulunamadı!'
        });
    }
};

module.exports = router;
