const express = require('express');
var router = express.Router();
const EventCat = require('../models/categorie');
var multer = require('multer');


var storage = multer.diskStorage({ //cette methode nous permet de modifier les nom des photos
    destination: function(req, file, cb) {
        cb(null, 'uploads/imgCat') //la destination des tofs c'est le dossier uploads
    },
    filename: function(req, file, cb) { //file qui a dans avatar, on prend le nom et on lui ajoute .png
        cb(null, file.fieldname + '-' + Date.now() + '.png')
    }
});
var upload = multer({ storage: storage });





router.get('/add', (req, res) => {

    res.render('categorie/add', {
        errors: req.flash('errors'),
        title: 'Add categorie',
        style: 'dashboard.css',
        style2: 'product.css',
        style3: 'dropzon.css',
        JS2: 'Dropzon.js'
    });
});


router.post('/add', upload.single('avatar'), (req, res) => {
    let test = new EventCat({ //new modéle
        codeCat: req.body.codeCatC,
        Name: req.body.NameC,
        mesure: req.body.mesureC,
        avatar: req.file.filename
    });

    test.save((err) => {
        if (!err) {
            console.log('product added !!!');
            req.flash('info', 'Produit crée avec succée !');
            res.redirect('/categorie/');
        } else {
            req.flash('errors', ' echeque !');
            console.log(err);
        }
    });
});

router.get('/', isAuthenticated, function(req, res) {

    EventCat.countDocuments({}, (err, total) => {

    }).then((response) => { //retourne le nombre de produit dans la bdd
        totalDocs = parseInt(response);


        EventCat.find({}, {}, (err, events) => { //ici
            let chunk = [];
            let chunkSize = 4;
            for (let i = 0; i < events.length; i += chunkSize) {
                chunk.push(events.slice(i, chunkSize + i));
            };
            //res.json(chunk);
            res.render('categorie/liste', {
                chunk: chunk,
                title: 'List Categorie',
                style: 'dashboard.css',
                style3: 'prodList.css',
                JS1: 'search.js',
                message: req.flash('info'),
                total: parseInt(totalDocs), //envoyer le total des document à la page listProduct
                //envoyer quel page à  afficher selon le nombre passer dans l'url
            });

        });
    })
})


router.get('/modifier/:id', isAuthenticated, (req, res) => {

    EventCat.findOne({ _id: req.params.id }, (err, event) => {


        if (!err) {


            res.render('categorie/modifier', {
                title: 'modifier une categorie  ',
                style: 'dashboard.css',
                style2: 'product.css',
                JS1: 'deleteEntities.js',
                style3: 'dropzon.css',
                style4: 'form.css',
                JS2: 'Dropzon.js',
                event: event,

                errors: req.flash('errors'),
                message: req.flash('info'),

            });

        } else {
            console.log(err)
        }

    });

});


router.post('/modifier', upload.single('avatar'), (req, res) => {


    let newfeilds = {
        codeCat: req.body.codeCat,
        Name: req.body.Name,
        mesure: req.body.mesure,
        avatar: req.body.noTofs
    }
    let query = { _id: req.body.idT }
        //poster dans la bdd 
    EventCat.updateOne(query, newfeilds, (err) => {
        if (!err) {
            req.flash('info', " la modification a bien marché"); //message vert de confirmation
            res.redirect('/categorie/modifier/' + req.body.idT);
        } else {
            console.log(err)
        }
    })


});




// modification dans la base de donnée plus les controles des champs
router.post('/modifierTof', upload.single('avatar'), (req, res) => {
    let newfeilds = {
        codeCat: req.body.codeTof,
        Name: req.body.nameCTof,
        mesure: req.body.priceCTof,
        avatar: req.file.filename
    }
    let query = { _id: req.body.idTof }
        //poster dans la bdd 
    EventCat.updateOne(query, newfeilds, (err) => {
        if (!err) {
            req.flash('info', " la modification a bien marché"); //message vert de confirmation
            res.redirect('/categorie/modifier/' + req.body.idTof);
        } else {
            console.log(err)
        }
    })

});


router.get('/delete/:id', isAuthenticated, (req, res) => {
    let query = { _id: req.params.id };


    EventCat.deleteOne(query, (err) => {

        if (err) {
            req.flash('info', " probleme de supprition ");
            res.redirect('/categorie/');
        } else {
            req.flash('info', " la supprition a bien marché");
            res.redirect('/categorie/');
        }
    })
});






module.exports = router;