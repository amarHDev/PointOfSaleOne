const mongoose = require('mongoose');
var eventSchema = new mongoose.Schema({
    CodeCilent: {
        type: String,
        required : true  //il faut que ce champs figure
    }?
    Date: {
        type: Number,
        required : true  //il faut que ce champs figure
    },
    Heur: {
         type: String,
         required : true  //il faut que ce champs figure
    },

    TotalPrice: {
        type: Number,
        required : true  //il faut que ce champs figure
    }

    
     
});

let ticketShema = mongoose.model('ticketShema', eventSchema, 'tickets');

module.exports =  ticketShema;