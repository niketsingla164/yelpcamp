const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const expressError = require('../utils/Expresserror');
const Schema = mongoose.Schema;
const userSchema = Schema({
    email : {
        type : String,
        required : true,
        unique : true
    }
})

userSchema.plugin(passportLocalMongoose);
module.exports = new mongoose.model('User',userSchema);