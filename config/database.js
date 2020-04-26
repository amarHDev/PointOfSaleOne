require('dotenv').config()
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || '', { useUnifiedTopology: true, useNewUrlParser: true } , (err) => {
   if (err){
       console.log(err);
   }else{
       console.log('connected to db successfuly ...');
   }
});

