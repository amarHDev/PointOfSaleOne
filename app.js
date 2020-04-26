require('dotenv').config()
const express = require('express');
const exphbs = require("express-handlebars");
const bodyParser = require('body-parser'); //pour extraire les données taper dans les formulaires
const session = require('express-session'); //affichage de msg à l'utilisateur
const flash = require('connect-flash'); //     idem
const passport = require('passport');
const passportSetup = require('./config/passport');
var CookieSession = require('cookie-session'); // Charge le middleware de sessions

const PORT = process.env.PORT || 8080;




const app = express();

//modules static
app.use(express.static('public')); //add our css js ans images
app.use(express.static('uploads')); //add les image tèlécharger l'utilisateur 
app.use(express.static('node_modules')); //add bootstrap and jquery ( installed)


// create a view enginge (ejs)
app.set('view engine', 'ejs');




//Bring body-parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
    // parse application/json
app.use(bodyParser.json())



// Configuration Session et flash
app.use(session({
    secret: 'Dgb',
    resave: false,
    saveUninitialized: false,
    // cookie: {maxAge: 60000*15} //la session peut etreactive tt se temps
}))

/* S'il n'y a pas de todolist dans la session,
on en crée une vide sous forme d'array avant la suite */
.use(function(req, res, next) {
    if (typeof(req.session.ticketList) == 'undefined') {
        req.session.ticketList = [];
        req.session.ticketSubTotal = 0;
        req.session.ticketItem = 0;
        req.session.ticketTotal = 0;
        req.session.remisePrcentage = 0;
        req.session.remisePoint = 0
    }
    next();
})




app.use(flash());

// bring passport 
app.use(passport.initialize());
app.use(passport.session());

app.get('*', (req, res, next) => {
    res.locals.user = req.user || null
    next()
})

//Routes
var events = require('./routes/handlers');
app.use('/', events);

//connection to bdd 
const db = require('./config/database');



app.listen(PORT);