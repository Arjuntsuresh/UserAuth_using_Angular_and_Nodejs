const mongoose = require('mongoose');

const adminSchema  = new mongoose.Schema({
    userName : {
        type: String,
        require : true,
    },
    email : {
        type: String,
        require : true,
    },
    password : {
        type: String,
        require : true,
    },
    active : {
        type: Boolean,
        require : true,
    }
});

const adminModel = mongoose.model('Admin', adminSchema)

module.exports  = adminModel;