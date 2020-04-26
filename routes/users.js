const express = require('express');
const router = express.Router();
const EventUser = require('../models/user');
const { check, validationResult } = require('express-validator'); //Pour vérifier le formulaire
const passport = require('passport');
var multer = require('multer');


// Stocker et récuperer les photos
//configure multer
var storage = multer.diskStorage({ //cette methode nous permet de modifier les nom des photos
    destination: function(req, file, cb) {
        cb(null, 'uploads/images') //la destination des tofs c'est le dossier uploads
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


// Route page : login (pour la Connexion)
router.get('/', function(req, res) {

    res.render('layouts/login', {
        title: 'Connexion',
        style: 'login.css',
        error: req.flash('error')
    });
});


// Connexion avec envoi du formulaire (methode POST)
router.post('/',
    passport.authenticate('local.login', {
        successRedirect: '/pos',
        failureRedirect: '/',
        badRequestMessage: 'Entrer tout les champs', //message par defaut
        failureFlash: true
    })
);








//Route pour afficher la liste des utilisateur  (userList)
router.get('/users/usersList/:pageN?', isAuthenticated, function(req, res) {

    let pageN = 1; //si aucune page n'est retourner on retourne la première par défaut

    if (req.params.pageN) {
        pageN = parseInt(req.params.pageN); //on fait un test sur le nbr passer en paramètre 
    }
    if (req.params.pageN == 0) {
        pageN = 1;
    }

    let q = {
        skip: 2 * (pageN - 1), //on déclare nos deux variable 
        limit: 2
    }




    //find total record de la bdd
    let totalDocs = 0;
    EventUser.countDocuments({}, (err, total) => {

    }).then((response) => { //retourne le nombre de produit dans la bdd

        totalDocs = parseInt(response);

        EventUser.find({}, {}, q, (err, events) => {
            let chunk = []
            let chunkSize = 3

            for (let i = 0; i < events.length; i += chunkSize) {
                chunk.push(events.slice(i, chunkSize + i))
            }
            res.render('employer/usersList', {
                title: 'liste des employées',
                style: 'dashboard.css',
                style2: 'usersList.css',
                chunk: chunk,
                message: req.flash('info'),
                total: parseInt(totalDocs), //envoyer le total des document à la page listProduct
                pageNmbr: pageN, //envoyer quel page à  afficher selon le nombre passer dans l'url

            });
        });
    })
});












// Route Ajouter utilisateur 
router.get('/users/addUser', isAuthenticated, function(req, res) {

    res.render('employer/addUser', {
        error: req.flash('error'),
        success: req.flash('success'),
        title: 'Ajouter Employer',
        style: 'dashboard.css',
        style2: 'product.css',
        style3: 'dropzon.css',
        JS2: 'Dropzon.js'

    });

});





//Save Users to DB (formulaire)
router.post('/users/addUser', upload.single('avatar'), passport.authenticate('local.signup', {
    successRedirect: '/users/addUser',
    failureRedirect: '/users/addUser',
    badRequestMessage: 'Entrer tout les champs',
    failureFlash: true
}));





// logout user  (Déconnexion)
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});



// la route pour modifier les Users
router.get('/users/modifier/:id', isAuthenticated, (req, res) => {

    EventUser.findOne({ _id: req.params.id }, (err, event) => {

        if (!err) {

            res.render('employer/modifierUser', {
                title: 'modifier un employée  ',
                style: 'dashboard.css',
                style2: 'form.css',
                style3: 'dropzon.css',
                JS1: 'deleteEntities.js',
                JS2: 'Dropzon.js',
                event: event,
                eventDate: moment(event.date).format('YYYY-MM-DD'),
                errors: req.flash('errors'),
                error: req.flash('error'),
                message: req.flash('info')
            });

        } else {
            console.log(err)
        }

    });

});






// modification du profils dans la base de donnée plus les controles des champs
router.post('/users/modifier', [

    check('firstName').isLength({ min: 3 }).withMessage('le prenom doit dépassé 3 car'), // Code must be at least 6 chars long
    check('lastName').isLength({ min: 3 }).withMessage('le nom doit dépassé 3 car'),
    check('email').isLength({ min: 3 }).withMessage('email invalid'),
    check('motDePasse').isLength({ min: 6 }).withMessage('mot de passe dois dépassé 6 car'),
    check('numTel').isLength({ min: 1 }).withMessage('Le champs telephone est obligatoire'),
    check('adresse').isLength({ min: 1 }).withMessage('Le champs adresse est obligatoire'),
    check('dateN').isLength({ min: 1 }).withMessage('Le champs date est obligatoire'),
    check('gender').isLength({ min: 1 }).withMessage('Le champs sexe est obligatoire'),
    check('usernameF').isLength({ min: 1 }).withMessage('Le champs Nom utilisateur est obligatoire'),
    
    check('codePostale').isLength({ min: 1 }).withMessage('Le champs Code postale est obligatoire'),
    check('avatar').isEmpty().withMessage('Champs photo exista pas')

], (req, res) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {

        req.flash('errors', errors.array())
        res.redirect('/users/modifier/' + req.body.id)
    } else {
        let newfeilds = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            mdp: req.body.motDePasse,
            tel: req.body.numTel,
            adress: req.body.adresse,
            date: req.body.dateN,
            gender: req.body.gender,
            username: req.body.usernameF,
            avatar: req.body.noTof,
            wilaya: req.body.wilaya,
            codePostale: req.body.codePostale
        }
        let query = { _id: req.body.id }

        //poster dans la bdd 
        EventUser.updateOne(query, newfeilds, (err) => {
            if (!err) {
                req.flash('info', " la modification a bien marché"); //message vert de confirmation
                res.redirect('/users/modifier/' + req.body.id);
            } else {
                console.log(err)
            }
        })
    }
});






// modification du mot de passe dans la base de donnée plus les controles des champs
router.post('/users/modifierMdp', [

    check('newMdp').isLength({ min: 3 }).withMessage('Champs Nouveau mot de passe invalide'), // Code must be at least 6 chars long
    check('ConfirmnewMdp').isLength({ min: 3 }).withMessage('Champs confirmation invalide')

], (req, res) => {


    const errors = validationResult(req)
    if (!errors.isEmpty()) {

        req.flash('errors', errors.array())
        res.redirect('/users/modifier/' + req.body.idMdp)
    } else {

        let newUser = new EventUser();
        let Nmdp = newUser.hashPassword(req.body.newMdp);

        let Cmdp = newUser.hashPassword(req.body.ConfirmnewMdp);

        if (newUser.comparePasswords(Nmdp, Cmdp)) {
            req.flash('error', 'Mot de passe de confirmation incorrecte');
            res.redirect('/users/modifier/' + req.body.idMdp)
        } else {




            let newfeilds = {
                firstName: req.body.prenomMdp,
                lastName: req.body.nomMdp,
                email: req.body.emailMdp,
                mdp: Cmdp,
                tel: req.body.telMdp,
                adress: req.body.adresseMdp,
                date: req.body.dateMdp,
                gender: req.body.genreMdp,
                username: req.body.userNameMdp,
                wilaya: req.body.wilayaMdp,
                codePostale: req.body.codePostalMdp,
                avatar: req.body.noTofMdp,
            }
            let query = { _id: req.body.idMdp }

            //poster dans la bdd 
            EventUser.updateOne(query, newfeilds, (err) => {
                if (!err) {
                    req.flash('info', " la modification a bien marché"); //message vert de confirmation
                    res.redirect('/users/modifier/' + req.body.idMdp);
                } else {
                    console.log(err)
                }
            })
        }
    }
});








//Modification de la photo dans la bdd
router.post('/users/modifierTof', upload.single('avatar'), [

    check('avatar').isEmpty().withMessage('Veuillez ajouter une photo')

], (req, res) => {
    console.log(req.file.avatar);
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        req.flash('errors', errors.array())
        res.redirect('/users/modifier/' + req.body.idTof)
    } else {

        let newfeild = {
            firstName: req.body.prenomTof,
            lastName: req.body.nomTof,
            email: req.body.emailTof,
            mdp: req.body.MdpTof,
            tel: req.body.telTof,
            adress: req.body.adresseTof,
            date: req.body.dateTof,
            gender: req.body.genreTof,
            username: req.body.userNameTof,
            wilaya: req.body.wilayaTof,
            codePostale: req.body.codePostalTof,
            avatar: req.file.filename

        }
        let query = { _id: req.body.idTof }

        //poster dans la bdd 
        EventUser.updateOne(query, newfeild, (err) => {
            if (!err) {
                req.flash('info', " la modification a bien marché"); //message vert de confirmation
                res.redirect('/users/modifier/' + req.body.idTof);
            } else {
                console.log(err)
            }
        })
    }
});








//delete User (Suppresion d'un utilisateur)
router.get('/users/delete/:id', isAuthenticated, (req, res) => {
    let query = { _id: req.params.id };
    console.log(query);

    EventUser.deleteOne(query, (err) => {

        if (err) {
            req.flash('info', " probleme de supprition ");
            res.redirect('/users/usersList')
        } else {
            req.flash('info', " la supprition a bien marché");
            res.redirect('/users/usersList')
        }
    })
});











module.exports = router;