const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');



// saving user object in the session
passport.serializeUser(function(user, done) {
    done(null, user.id);   // on sauvegarde le id de l'utilisateur dans la session
});


passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {  //pour récupérer l'utilisateur à partir de la session
        done(err, user);
    });
});




// login user object in the session 
passport.use('local.login',
    new LocalStrategy({
        usernameField: 'username',  //usernameField reçois les données passer dans le formulaire via l'attribu name qu'on spécifie
        passwordField: 'mdp',
        passReqToCallback: true  //permet de passer les paramètre à travers body vers la fct de callback en desous
    },(req, username, password, done) =>{
            
    
        User.findOne({ username: username }, (err, user)=> {
            if (err) {
                return done(null, false, req.flash('error', "Une erreur inattendu c'est produite "))
            }
            if (!user) {
                return done(null, false, req.flash('error', "L'utilisateur n'existe pas"))
            }
            if (user) {
                //controler le mdp avec hashage
                if (user.comparePasswords(password, user.mdp)) {
    
                    return done(null, user)
       
                } else {
                    return done(null, false, req.flash('error', 'Mot de passe incorrect'))
    
                }
    
            }    
        })
    }));



// Ajouter des utilisateurs (caissier)
passport.use('local.signup', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'mdp',
        passReqToCallback: true
}, (req, username, password, done) => {

        User.findOne({ username: username }, (err, user) => {
            if (err) {
                return done(null, false, req.flash('error', 'Veuillez saisir une valeur'))
            }
            if (user) {
                return done(null, false, req.flash('error', "Ce nom d'utilisateur existe déja"))
            }
            if (!user) {
                //create user
                let newUser = new User({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    username: req.body.username,
                    email:req.body.email,
                    tel:req.body.tel,
                    adress: req.body.adress,
                    mdp: req.body.mdp,
                    date: req.body.date,
                    gender:req.body.gender,
                    avatar: req.file.filename,
                    wilaya: req.body.wilaya,
                    codePostale: req.body.codePostale
                })
                newUser.mdp = newUser.hashPassword(req.body.mdp)

                newUser.save((err, user) => {
                    if (!err) {
                        console.log('success')
                        return done(null, user, req.flash('success', 'Ajouter avec succes'))
                    } else {
                        console.log(err)
                    }
                })

            }
        })
    }));

