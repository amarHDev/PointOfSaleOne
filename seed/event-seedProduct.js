const db = require('../config/database');
const EventProduct = require('../models/products');

let newProducts = [

    new  EventProduct({
        Code: '125468',
        Qtt:'160',
        Name:'Baskets',
        Price:'25',
        Categorie:'bascket',
        Taille:'L'
    }),
    
];



newProducts.forEach( (event)=>{
    event.save( (err)=>{
        if(err){
            console.log(err);
        }
    });
});