var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');

var Surgun = mongoose.model('Surgun');
var User = mongoose.model('User');

var config = require('../config/config');


//Login Router
router.post('/login', function(req, res) {
    User.findOne({email: req.body.email}, function (err, user) {
        if(err)
            throw err;
        if(!user)
            console.log('Kullanıcı bulunamadı.');
        if(user){
            user.verifyPassword(req.body.password, function (err, isMatch) {
                if(err){
                    res.status(500).json({
                        success: false,
                        data: err
                    });
                }else if(!isMatch){
                    res.json({
                        success: false,
                        data: 'Girdiğiniz bigileri kontrol edin!'
                    });
                }else if(isMatch){
                    var token = jwt.sign({ _id : user._id }, config.Secret);
                    user.token = token;

                    user.save(function (err) {
                        if(err)
                            throw err;
                        console.log('Token kaydı başarılı.');
                    });

                    res.json({
                        success: true,
                        data: token
                    });
                }
            });
        }
    });
});

//Register Router
router.post('/register', function (req, res) {
    User.findOne({email: req.body.email}, function (err, user) {
        if(err)
            throw err;
        if(user){
            res.json({
                data: 'Bu email adresi kullanılıyor.'
            });
        } else{
            var userModel = new User();
            userModel.email = req.body.email;
            userModel.password = userModel.generateHash(req.body.password);

            userModel.save(function (err) {
                if(err)
                    throw err;
                console.log('Kayıt Başarılı');
            });
        }
    });
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
