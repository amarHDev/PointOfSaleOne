const mongoose = require('mongoose');
var eventCategorie = new mongoose.Schema({

    Name: {
        type: String,
        require: true
    },
    codeCat: {
        type: Number,
        require: true
    },
    avatar: {
        type: String,
        require: true
    },
    mesure: {
        type: String,
        require: true
    }

})



let CatSchema = mongoose.model('CatSchema', eventCategorie, 'categorie');

module.exports = CatSchema;