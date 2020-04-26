const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://admin:<admin1234>@cluster0-i3eps.mongodb.net/test?retryWrites=true&w=majority', { useUnifiedTopology: true, useNewUrlParser: true } , (err) => {
   if (err){
       console.log(err);
   }else{
       console.log('connected to db successfuly ...');
   }
  });

