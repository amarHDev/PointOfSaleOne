require('dotenv').config()
const mongoose = require('mongoose');

mongoose.connect( process.env.MONGODB_URL|| 'mongodb://localhost:27017/posdb' , { useUnifiedTopology: true} , (err) => {
   if (err){
       console.log(err);
       console.log('connected eroorrrr !!! ...');
   }else{
       console.log('connected to db successfuly ...');
   }
});


