const mongoose = require('mongoose');
var eventSchema = new mongoose.Schema({
    Code: {
        type: Number,
        required : true  //il faut que ce champs figure
    },
    Qtt: {
        type: Number,
        required : true  //il faut que ce champs figure
    },
     Name: {
         type: String,
         required : true  //il faut que ce champs figure
     },

     Price: {
        type: Number,
        required : true  //il faut que ce champs figure
    },

    Categorie: {
        type: String,
        required : true  //il faut que ce champs figure
    },
    avatar: {
        type: String,
        require: true
    }
     
});

let productShema = mongoose.model('productShema', eventSchema, 'products');

module.exports =  productShema;