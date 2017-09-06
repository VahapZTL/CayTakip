var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt   = require('bcrypt-nodejs');

var userSchema = new Schema({
    email: String,
    password: String,
    token: String,
    surgun: [{
        type: Schema.ObjectId,
        ref: 'Surgun'
    }],
    createdDate: {
        type: Date,
        default: Date.now
    }
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password, cb) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
