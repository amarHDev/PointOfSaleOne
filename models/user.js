const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs')
var eventSchema = new mongoose.Schema({
     firstName: {
         type: String,
         required : true  //il faut que ce champs figure
     },

     lastName: {
        type: String,
        required : true  //il faut que ce champs figure
    },
    username:{
        type: String,
        required : true  //il faut que ce champs figure
    },
    email: {
        type: String,
        require: true
    },
    tel:{
        type: Number,
        require: true
    },
    adress: {
        type: String,
        require: true
    },
    mdp: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        require: true
    },
    gender: {
         type: String,
         require: true
    },
    avatar: {
        type: String,
        require: true
    },
    wilaya: {
        type: String,
        require: true
    },
    codePostale:{
        type: Number,
        require: true
    }
     
});


eventSchema.methods.hashPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

eventSchema.methods.comparePasswords = (password, hash) => {
    return bcrypt.compareSync(password, hash)
}


let userShema = mongoose.model('userShema', eventSchema, 'users');

module.exports =  userShema;