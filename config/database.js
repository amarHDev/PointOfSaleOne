require('dotenv').config()
const mongoose = require('mongoose');

mongoose.connect(`mongodb+srv://posdb:adminadmin@cluster0-i3eps.mongodb.net/test?retryWrites=true&w=majority`, { useUnifiedTopology: true, useNewUrlParser: true } , (err) => {
   if (err){
       console.log(err);
       console.log('connected eroorrrr !!! ...');
   }else{
       console.log('connected to db successfuly ...');
   }
});

