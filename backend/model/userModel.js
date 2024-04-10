const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required :true
    },
    mobile: {
        type: String,
        required :true
    },
    email: {
        type: String,
        unique : true,
        required :true
    },
    password : {
        type : String,
        required : true
    },
    image : {
        type : String
    }
})

const userModel = mongoose.model('User', userSchema)

module.exports = userModel;