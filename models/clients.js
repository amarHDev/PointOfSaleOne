const mongoose = require('mongoose');
var eventSchema = new mongoose.Schema({

     firstName: {
         type: String,
         required : true  //il faut que ce champs figure
     },

     lastName: {
        type: String,
        required : true  //il faut que ce champs figure
    },
    codeClient: {
        type: Number,
        require: true
    },
    avatar: {
        type: String,
        require: true
    },
    remise:{
        type: String,
        require: true
    }
     
});

let clientShema = mongoose.model('clientShema', eventSchema, 'clients');

module.exports =  clientShema;