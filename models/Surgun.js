var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SurgunSchema = new Schema({

    surgunNumarasi: String,
    verilenCay:[{
        verilenMiktar: Number,
        kesilenYer: String,
        verilmeTarihi: {
            type: Date,
            default: Date.now
        }
    }],
    borc_alacak:[{
        borc: Boolean,
        alacak: Boolean,
        miktar: Number
    }],
    yevmiyeler: [{
        isim: String,
        miktar: Number
    }],
    olusturulmaTarihi: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Surgun', SurgunSchema);