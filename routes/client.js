const express = require('express');
var router = express.Router();
const EventClient = require('../models/clients');
const { check, validationResult } = require('express-validator'); //Pour vérifier le formulaire
const EventProduct = require('../models/products'); //pour le modal pos
var multer = require('multer');


// Récupérer et sauvegarder les photos des clients
//configure multer
var storage = multer.diskStorage({ //cette methode nous permet de modifier les nom des photos
    destination: function(req, file, cb) {
        cb(null, 'uploads/imgClient') //la destination des tofs c'est le dossier uploads
    },
    filename: function(req, file, cb) { //file qui a dans avatar, on prend le nom et on lui ajoute .png
        cb(null, file.fieldname + '-' + Date.now() + '.png')
    }
});
var upload = multer({ storage: storage });

// recuperer la date pour la modification du profil
const moment = require('moment');
moment().format();




isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) return next()
    res.redirect('/')
}


//Route pouur jouter des clients (Ajout au niveau le la page addClient)
router.get('/addClients', isAuthenticated, function(req, res) {

    res.render('client/addClient', {
        errors: req.flash('errors'),
        error: req.flash('error'),
        message: req.flash('info'),
        title: 'Add Client',
        style: 'dashboard.css',
        style2: 'product.css',
        style3: 'dropzon.css',
        JS2: 'Dropzon.js',
    });
});







//Route pouur jouter des clients (Ajout au niveau le la page POS)
router.get('/addClientsM', isAuthenticated, function(req, res) {

    res.render('layouts/pos', {
        errors2: req.flash('errors2'),
    });
});









//Enregistrer les clients dans la bdd (au niveau le la page addClient)
router.post('/addClients', upload.single('avatar'), [

    check('firstName').isLength({ min: 1 }).withMessage('Le champs prénom est obligatoire'), // Code must be at least 6 chars long
    check('lastName').isLength({ min: 1 }).withMessage('Le champs Nom est obligatoire'),
    check('codeClient').isLength({ min: 1 }).withMessage('Le code client est obligatoire'),

], function(req, res) {

    /*Pour les erreur de formulaires */
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // return res.status(422).json({ errors: errors.array() });     pour avoir les erreur en Json
        req.flash('errors', errors.array());
        res.redirect('/client/addClients'); //le chemin sera pas le chemin de la page mais la route qui va mener à la page  
    } else {
        let query = req.body.codeClient;
        if (!req.file) {
            req.flash('error', 'L\'image est obligatoire');
            res.redirect('/client/addClients');
        } else {
            EventClient.findOne({ codeClient: query }, (err, events) => {
                if (err) {
                    req.flash('error', 'Une erreur inattendu c\'est produite veuillez réesseyer');
                    res.redirect('/client/addClients');
                }
                if (events) {
                    req.flash('error', 'Ce client existe déja !');
                    res.redirect('/client/addClients');
                }
                if (!events) {

                    let client = new EventClient({
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        codeClient: req.body.codeClient,
                        remise: 0,
                        avatar: req.file.filename

                    });

                    client.save((err) => {
                        if (!err) {
                            console.log('Client ajouter avec succès');
                            req.flash('info', 'Client ajouté avec succé !')
                            res.redirect('/client/addClients');
                        } else {
                            console.log(err);
                        }
                    })

                }
            })
        }
    }

});








//Enregistrer les clients dans la bdd (au niveau le la page POS)
router.post('/addClientsM', upload.single('avatar'), [

    check('firstName').isLength({ min: 1 }).withMessage('Le champs prénom est obligatoire'), // Code must be at least 6 chars long
    check('lastName').isLength({ min: 1 }).withMessage('Le champs Nom est obligatoire'),
    check('codeClient').isLength({ min: 1 }).withMessage('Le champs codeClient est obligatoire'),

], function(req, res) {

    /*Pour les erreur de formulaires */
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors2 = validationResult(req);
    if (!errors2.isEmpty()) {

        EventProduct.find({}, (err, events) => {
            let chunk = [];
            let chunkSize = 4;
            for (let i = 0; i < events.length; i += chunkSize) {
                chunk.push(events.slice(i, chunkSize + i));
            }

            // return res.status(422).json({ errors: errors.array() });     pour avoir les erreur en Json
            req.flash('errors2', errors2.array());
            res.redirect('/pos'); //le chemin sera pas le chemin de la page mais la route qui va mener à la page
        })

    } else {

        let query = req.body.codeClient;
        if (!req.file) {
            req.flash('error', 'L\'image est obligatoire');
            res.redirect('/pos');
        } else {
            EventClient.findOne({ codeClient: query }, (err, events) => {
                if (err) {

                    req.flash('error', 'Une erreur inattendu c\'est produite veuillez réesseyer');
                    res.redirect('/pos');
                }
                if (events) {
                    req.flash('error', 'Ce client existe déja !');
                    res.redirect('/pos');
                }
                if (!events) {

                    let client = new EventClient({
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        codeClient: req.body.codeClient,
                        remise: 0,
                        avatar: req.file.filename

                    });
                    client.save((err) => {
                        if (!err) {
                            console.log('Client ajouter avec succès');
                            req.flash('info', 'Client ajouté avec succé !')
                            res.redirect('/pos');
                        } else {
                            console.log(err);
                        }
                    })
                }
            })
        }
    }
});










//Route pour l'affichage de la liste des clients  (clientList)
router.get('/clientLists/:pageN?', isAuthenticated, function(req, res) {

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
    EventClient.countDocuments({}, (err, total) => {

    }).then((response) => { //retourne le nombre de produit dans la bdd
        totalDocs = parseInt(response);


        EventClient.find({}, {}, q, (err, events) => {
            let chunk = [];
            let chunkSize = 4;
            for (let i = 0; i < events.length; i += chunkSize) {
                chunk.push(events.slice(i, chunkSize + i));
            };

            //res.json(chunk);
            res.render('client/clientList', {
                chunk: chunk,
                title: 'List Client',
                style: 'dashboard.css',
                style2: 'client.css',
                JS1: 'search.js',
                total: parseInt(totalDocs), //envoyer le total des document à la page listProduct
                pageNmbr: pageN, //envoyer quel page à  afficher selon le nombre passer dans l'url
            });
        });
    })
});




// la route pour modifier les Client
router.get('/modifier/:id', isAuthenticated, (req, res) => {

    EventClient.findOne({ _id: req.params.id }, (err, event) => {

        if (!err) {

            res.render('client/modifierClient', {
                title: 'modifier un Client  ',
                style: 'dashboard.css',
                style2: 'product.css',
                style3: 'Modifierclient.css',
                style4: 'dropzon.css',
                style5: 'form.css',
                JS2: 'Dropzon.js',
                JS1: 'deleteEntities.js',
                JS3: 'JSpos.js',
                event: event,
                errors: req.flash('errors'),
                message: req.flash('info')
            });

        } else {
            console.log(err)
        }
    });
});







// modification Profils du Client
router.post('/modifier', [

    check('firstName').isLength({ min: 1 }).withMessage('Le champs prénom est obligatoire'), // Code must be at least 6 chars long
    check('lastName').isLength({ min: 1 }).withMessage('Le champs Nom est obligatoire'),
    check('codeClient').isLength({ min: 1 }).withMessage('Le champs codeClient est obligatoire'),
    check('codeClient').isLength({ min: 1 }).withMessage('Le champs codeClient est obligatoire'),
    check('avatar').isEmpty().withMessage('Champs photo existe pas')


], (req, res) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {

        req.flash('errors', errors.array())
        res.redirect('/client/modifier/' + req.body.ids)

    } else {

        let newfeilds = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            codeClient: req.body.codeClient,
            remise: req.body.remise,
            avatar: req.body.noTofs,
        }

        let query = { _id: req.body.ids }
            //poster dans la bdd 

        EventClient.updateOne(query, newfeilds, (err) => {
            if (!err) {
                req.flash('info', " la modification a bien marché"); //message vert de confirmation
                res.redirect('/client/modifier/' + req.body.ids);
            } else {
                console.log(err)
            }
        })
    }
});





// modification photo du Client
router.post('/modifierTof', upload.single('avatar'), [

    check('avatar').isEmpty().withMessage('Veuillez ajouter une photo')

], (req, res) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {

        req.flash('errors', errors.array())
        res.redirect('/client/modifier/' + req.body.idTof)

    } else {

        let newfeilds = {
            firstName: req.body.prenomTof,
            lastName: req.body.nomTof,
            codeClient: req.body.codeClientTof,
            remiseTof: req.body.remiseTof,
            avatar: req.file.filename
        }

        let query = { _id: req.body.idTof }

        //poster dans la bdd 
        EventClient.updateOne(query, newfeilds, (err) => {
            if (!err) {
                req.flash('info', " la modification a bien marché"); //message vert de confirmation
                res.redirect('/client/modifier/' + req.body.idTof);
            } else {
                console.log(err)
            }
        })
    }
});








//Supprimer un Client
router.delete('/delete/:id', upload.single('avatar'), (req, res) => {

    let query = { _id: req.params.id };

    EventClient.deleteOne(query, (err) => {

        if (!err) {
            req.flash('info', " la suppritions a bien marché");
            res.status(200).json('supprimer')
        } else {
            res.status(404).json('il ya une erreur')
        }
    })
});












module.exports = router;