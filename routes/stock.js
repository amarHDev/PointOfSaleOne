const express = require('express');
var router = express.Router();
const EventProduct = require('../models/products');


isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) return next()
    res.redirect('/')
}



router.get('/:pageN?', isAuthenticated, function(req, res) {
    let pageN = 1; //si aucune page n'est retourner on retourne la première par défaut

    if (req.params.pageN) {
        pageN = parseInt(req.params.pageN); //on fait un test sur le nbr passer en paramètre 
    }
    if (req.params.pageN == 0) {
        pageN = 1;
    }

    let q = {
        skip: 8 * (pageN - 1), //on déclare nos deux variable 
        limit: 8
    }

    //find total record de la bdd
    let totalDocs = 0;
    EventProduct.countDocuments({}, (err, total) => {

    }).then((response) => { //retourne le nombre de produit dans la bdd
        totalDocs = parseInt(response);


        EventProduct.find({}, {}, q, (err, events) => { //ici
            let chunk = [];
            let chunkSize = 4;
            for (let i = 0; i < events.length; i += chunkSize) {
                chunk.push(events.slice(i, chunkSize + i));
            };
            //res.json(chunk);
            res.render('layouts/stock', {
                chunk: chunk,
                title: 'Stock',
                style: 'dashboard.css',
                style2: 'client.css',
                JS1: 'search.js',
                total: parseInt(totalDocs), //envoyer le total des document à la page listProduct
                pageNmbr: pageN, //envoyer quel page à  afficher selon le nombre passer dans l'url
            });

        });
    })


});



module.exports = router;