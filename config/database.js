require('dotenv').config()
const mongoose = require('mongoose');

mongoose.connect( process.env.DATABASE || 'mongodb://localhost:27017/posdb' , { useUnifiedTopology: true , useNewUrlParser: true } , (err) => {
   if (err){
       console.log(err);
       console.log('connected eroorrrr !!! ...');
   }else{
       console.log('connected to db successfuly ...');
   }
});


