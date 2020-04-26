const express = require('express');
var router = express.Router();
const EventProduct = require('../models/products');
const { check, validationResult } = require('express-validator'); //Pour vérifier le formulaire
var multer = require('multer');

const EventCat = require('../models/categorie');

//configure multer
var storage = multer.diskStorage({ //cette methode nous permet de modifier les nom des photos
    destination: function(req, file, cb) {
        cb(null, 'uploads/imgProduct') //la destination des tofs c'est le dossier uploads
    },
    filename: function(req, file, cb) { //file qui a dans avatar, on prend le nom et on lui ajoute .png
        cb(null, file.fieldname + '-' + Date.now() + '.png')
    }
});
var upload = multer({ storage: storage });

isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) return next()
    res.redirect('/')
}


router.get('/addProduct', isAuthenticated, function(req, res) {


    EventCat.find({}, {}, (err, events) => { //ici

        let chunk = [];
        let chunkSize = 4;
        for (let i = 0; i < events.length; i += chunkSize) {
            chunk.push(events.slice(i, chunkSize + i));
        };
        res.render('produit/addProduct', {
            errors: req.flash('errors'),
            title: 'Add Product',
            style: 'dashboard.css',
            style2: 'product.css',
            style3: 'dropzon.css',
            JS2: 'Dropzon.js',
            chunk: chunk,

        });
    });
});

//Save Product to DB
router.post('/addProduct', upload.single('avatar'), [

    check('Code').isLength({ min: 3 }).withMessage('Code Invalide'), // Code must be at least 6 chars long
    check('Qtt').isLength({ min: 1 }).withMessage('Ce champs ne doit pas être vide'),
    check('Name').isLength({ min: 3 }).withMessage('Nom produit Invalide'),
    check('Price').isLength({ min: 1 }).withMessage('Ce champs ne doit pas être vide'),
    check('Categorie').isLength({ min: 3 }).withMessage('Categorie Invalide, soit être >=3 caractères'),

], function(req, res) {

    /*Pour les erreur de formulaires */
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // return res.status(422).json({ errors: errors.array() });     pour avoir les erreur en Json
        req.flash('errors', errors.array());
        res.redirect('/product/addProduct'); //le chemin sera pas le chemin de la page mais la route qui va mener à la page

    } else {
        console.log(req.body);
        let newEvent = new EventProduct({ //new modéle
            Code: req.body.Code,
            Qtt: req.body.Qtt,
            Name: req.body.Name,
            Price: req.body.Price,
            Categorie: req.body.Categorie,
            avatar: req.file.filename

        });

        newEvent.save((err) => {
            if (!err) {
                console.log('product added !!!');
                req.flash('info', 'Produit crée avec succée !');
                res.redirect('/product/ProductList');
            } else {
                console.log(err);
            }
        });
    }





});



//Display ProductList
router.get('/ProductList/:pageN?', isAuthenticated, function(req, res) {
    let pageN = 1; //si aucune page n'est retourner on retourne la première par défaut

    if (req.params.pageN) {
        pageN = parseInt(req.params.pageN); //on fait un test sur le nbr passer en paramètre 
    }
    if (req.params.pageN == 0) {
        pageN = 1;
    }

    let q = {
        skip: 6 * (pageN - 1), //on déclare nos deux variable 
        limit: 6
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
            res.render('produit/productList', {
                chunk: chunk,
                title: 'List Product',
                style: 'dashboard.css',
                style3: 'prodList.css',
                JS1: 'search.js',
                message: req.flash('info'),
                total: parseInt(totalDocs), //envoyer le total des document à la page listProduct
                pageNmbr: pageN, //envoyer quel page à  afficher selon le nombre passer dans l'url
            });

        });
    })


});





// la route pour modifier les produits
router.get('/modifier/:id', isAuthenticated, (req, res) => {

    EventProduct.findOne({ _id: req.params.id }, (err, event) => {

       
        if (!err) {
            EventCat.find({}, {}, (err, events) => { //ici

                let chunk = [];
                let chunkSize = 4;
                for (let i = 0; i < events.length; i += chunkSize) {
                    chunk.push(events.slice(i, chunkSize + i));
                };
         
    
            res.render('produit/modifierProduct', {
                title: 'modifier un product  ',
                style: 'dashboard.css',
                style2: 'product.css',
                JS1: 'deleteEntities.js',
                style3: 'dropzon.css',
                style4: 'form.css',
                JS2: 'Dropzon.js',
                event: event,
                errors: req.flash('errors'),
                message: req.flash('info'),
                chunk:chunk
            });
        });
        } else {
            console.log(err)
        }

    });

});



// modification dans la base de donnée plus les controles des champs
router.post('/modifier', upload.single('avatar'), [

    check('Code').isLength({ min: 6 }).withMessage('Code Invalide'), // Code must be at least 6 chars long
    check('Qtt').isLength({ min: 1 }).withMessage('la qauntité ne doit pas être vide'),
    check('Name').isLength({ min: 3 }).withMessage('Nom produit Invalide'),
    check('Price').isLength({ min: 1 }).withMessage('Le prix ne doit pas être vide'),
    check('Categorie').isLength({ min: 3 }).withMessage('Categorie Invalide, soit être >=3 caractères'),

], (req, res) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {

        req.flash('errors', errors.array())
        res.redirect('/product/modifier/' + req.body.id)
    } else {
        let newfeilds = {
            Code: req.body.Code,
            Qtt: req.body.Qtt,
            Name: req.body.Name,
            Price: req.body.Price,
            Categorie: req.body.Categorie,
            avatar: req.body.noTofs
        }
        let query = { _id: req.body.id }
            //poster dans la bdd 
        EventProduct.updateOne(query, newfeilds, (err) => {
            if (!err) {
                req.flash('info', " la modification a bien marché"); //message vert de confirmation
                res.redirect('/product/modifier/' + req.body.id);
            } else {
                console.log(err)
            }
        })
    }

});




// modification dans la base de donnée plus les controles des champs
router.post('/modifierTof', upload.single('avatar'), [

    check('avatar').isEmpty().withMessage('Veuillez ajouter une photo')

], (req, res) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {

        req.flash('error', errors.array())
        res.redirect('/product/modifier/' + req.body.idTof)
    } else {
        let newfeilds = {
            Code: req.body.codeTof,
            Qtt: req.body.qttTof,
            Name: req.body.nameCTof,
            Price: req.body.priceCTof,
            Categorie: req.body.catTof,
            avatar: req.file.filename
        }
        let query = { _id: req.body.idTof }
            //poster dans la bdd 
        EventProduct.updateOne(query, newfeilds, (err) => {
            if (!err) {
                req.flash('info', " la modification a bien marché"); //message vert de confirmation
                res.redirect('/product/modifier/' + req.body.idTof);
            } else {
                console.log(err)
            }
        })
    }

});








//delete Product
router.get('/delete/:id', isAuthenticated, (req, res) => {
    let query = { _id: req.params.id };
    console.log(query);

    EventProduct.deleteOne(query, (err) => {

        if (err) {
            req.flash('info', " probleme de supprition ");
            res.redirect('/product/ProductList')
        } else {
            req.flash('info', " la supprition a bien marché");
            res.redirect('/product/ProductList')
        }
    })
});
router.get('/addProductM', isAuthenticated, function(req, res) {

    res.render('layouts/pos', {
        errors2: req.flash('errors2'),
    });
});
router.post('/addProductM', upload.single('avatar'), [

    check('Code').isLength({ min: 3 }).withMessage('Code Invalide'), // Code must be at least 6 chars long
    check('Qtt').isLength({ min: 1 }).withMessage('Ce champs ne doit pas être vide'),
    check('Name').isLength({ min: 3 }).withMessage('Nom produit Invalide'),
    check('Price').isLength({ min: 1 }).withMessage('Ce champs ne doit pas être vide'),
    check('Categorie').isLength({ min: 3 }).withMessage('Categorie Invalide, soit être >=3 caractères'),

], function(req, res) {

    /*Pour les erreur de formulaires */
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // return res.status(422).json({ errors: errors.array() });     pour avoir les erreur en Json
        req.flash('errors', errors.array());
        res.redirect('/pos'); //le chemin sera pas le chemin de la page mais la route qui va mener à la page

    } else {
        console.log(req.body);
        let newEvent = new EventProduct({ //new modéle
            Code: req.body.Code,
            Qtt: req.body.Qtt,
            Name: req.body.Name,
            Price: req.body.Price,
            Categorie: req.body.Categorie,
            avatar: req.file.filename

        });

        newEvent.save((err) => {
            if (!err) {
                console.log('product added !!!');
                req.flash('info', 'Produit crée avec succée !');
                res.redirect('/pos');
            } else {
                console.log(err);
            }
        });
    }





});


module.exports = router;