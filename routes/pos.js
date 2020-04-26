const express = require('express');
const url = require('url');
const querystring = require('querystring');
var router = express.Router();
const EventProduct = require('../models/products'); //pour envoyer les donnée de la bdd (des produits) vers pos.ejs
const EventClient = require('../models/clients');
var bodyParser = require('body-parser'); // Charge le middleware de gestion des paramètres
var urlencodedParser = bodyParser.urlencoded({
    extended: false
});



isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) return next()
    res.redirect('/')
}

// Route page POS
router.get('/:pageN?', isAuthenticated, function(req, res) {

    console.log(req.session.ticketList);
    let pageN = 1; //si aucune page n'est retourner on retourne la première par défaut

    if (req.params.pageN) {
        pageN = parseInt(req.params.pageN); //on fait un test sur le nbr passer en paramètre 
    }
    if (req.params.pageN == 0) {
        pageN = 1;
    }

    let q = {
        skip: 12 * (pageN - 1), //on déclare nos deux variable 
        limit: 12
    }

    //find total record de la bdd
    let totalDocs = 0;
    EventProduct.countDocuments({}, (err, total) => {

    }).then((response) => { //retourne le nombre de produit dans la bdd

        totalDocs = parseInt(response);

        EventProduct.find({}, {}, q, (err, events) => {
            let chunk = [];
            let chunkSize = 4;
            for (let i = 0; i < events.length; i += chunkSize) {
                chunk.push(events.slice(i, chunkSize + i));
            }


            //res.json(chunk);
            res.render('layouts/pos', {
                chunk: chunk,
                errors2: req.flash('errors2'),
                error: req.flash('error'),
                message: req.flash('info'),
                title: 'POS',
                style: 'dashboard.css',
                style2: 'pos.css',
                JS1: 'JSpos.js',
                style3: 'dropzon.css',
                JS2: 'Dropzon.js',
                JS4: 'search.js',

                total: parseInt(totalDocs), //envoyer le total des document à la page listProduct
                pageNmbr: pageN, //envoyer quel page à  afficher selon le nombre passer dans l'url
                ticketList: req.session.ticketList,
                ticketSubTotal: req.session.ticketSubTotal,
                ticketTotal: req.session.ticketTotal,
                ticketItem: req.session.ticketItem,
                remisePrcentage: req.session.remisePrcentage,
                remisePoint: req.session.remisePoint
            });
        });
    });
})


/*On ajoute un élèment à la liste */
.post('/ajouter', urlencodedParser, function(req, res) {

    let tr = false;
    let qttOnItem = 0;
    let cpt = 0;

    //Si codeProduit taper Vide
    if (req.body.newArticle == '') {
        res.redirect('/pos');
    }

    //Si on tape qlqchose dans le champs (code produit à ajouter)
    if (req.body.newArticle != '') {

        let query = { Code: req.body.newArticle };

        if (req.session.ticketList.length == 0) { //si pas d'item dans la liste

            //on cherhe le produit dans la BDD et on l'ajoute le produit dans la liste
            EventProduct.find(query, function(err, products) {
                if (err) throw err;
                if (!products.length) {
                    console.log("Ce produit n'existe pas");
                    res.redirect('/pos');
                } else {

                    const prod = {
                        Name: products[0].Name,
                        Price: products[0].Price,
                        Avatar: products[0].avatar,
                        Code: products[0].Code,
                        Qtt: products[0].Qtt,
                        qttOnItem: qttOnItem + 1,
                        cpt: cpt + 1
                    };

                    req.session.ticketSubTotal = req.session.ticketSubTotal + products[0].Price;
                    req.session.ticketTotal = req.session.ticketSubTotal;
                    req.session.ticketList.push(prod);
                    req.session.ticketItem = req.session.ticketItem + 1;
                    res.redirect('/pos');
                }
            })

        } else { //si pas premier produit , faut tester esq le produit est déja ou non dans la liste 
            var ind;

            console.log('jhahjajaja')
            for (let i = 0, l = req.session.ticketList.length; i < l; i++) {

                console.log(req.session.ticketList[i])
                if (req.session.ticketList[i].Code == req.body.newArticle) { //si le produit existe déja tr = true
                    console.log('trouvéé')
                    tr = true;
                    ind = i; //on récupére l'index du produit
                }
            }

            // req.session.ticketList.forEach(function(value, index, array){       
            // })

            console.log('index');
            console.log(ind);

            if (tr == false) { //le produit n'esxite pas encore il faut l'ajouter  (si tr = false)

                EventProduct.find(query, function(err, products) {
                    if (err) throw err;
                    if (!products.length) {
                        console.log("Ce produit n'existe pas");
                        res.redirect('/pos');
                    } else {
                        const prod = {
                            Name: products[0].Name,
                            Price: products[0].Price,
                            Avatar: products[0].avatar,
                            Code: products[0].Code,
                            Qtt: products[0].Qtt,
                            qttOnItem: qttOnItem + 1,
                            cpt: cpt + 1
                        };


                        req.session.ticketSubTotal = req.session.ticketSubTotal + products[0].Price;
                        req.session.ticketTotal = req.session.ticketSubTotal;
                        req.session.ticketList.push(prod);
                        req.session.ticketItem = req.session.ticketItem + 1;
                        res.redirect('/pos');
                    }
                })

                //si le produit existe dans la liste il ne faut pas le dupliquer 
            } else if (tr == true) {

                console.log('le produit existe déja')


                //on incrémente le prix au niveau du ticket et on décrémente la qtt de 1
                for (let i = 0, l = req.session.ticketList.length; i < l; i++) {

                    console.log('index = ind')
                    console.log(ind)
                    console.log(i)
                    console.log(req.session.ticketList[i].Code)

                    if (i == ind) { //si le produit existe déja tr = true

                        EventProduct.find({ Code: req.session.ticketList[i].Code }, function(err, products) {
                            if (err) throw err;
                            if (!products.length) {
                                console.log("Ce produit n'existe pas");
                                res.redirect('/pos');
                            } else {
                                req.session.ticketSubTotal = req.session.ticketSubTotal + products[0].Price;
                                req.session.ticketTotal = req.session.ticketSubTotal;
                                console.log(req.session.ticketList[i].Price);
                                console.log('iiiiiiii')

                                req.session.ticketList[i].Price = req.session.ticketList[i].Price + products[0].Price;

                                req.session.ticketList[i].Qtt = req.session.ticketList[i].Qtt - 1;
                                req.session.ticketList[i].qttOnItem = req.session.ticketList[i].qttOnItem + 1
                                req.session.ticketList[i].cpt = req.session.ticketList[i].cpt + 1;

                                console.log(req.session.ticketList[i].Price);
                                //chercher le produit à ajouter dans la bdd

                                console.log('total = ')
                                res.redirect('/pos');
                            }

                        })

                    } else {
                        req.session.ticketList[i].Price = req.session.ticketList[i].Price;
                        req.session.ticketList[i].Qtt = req.session.ticketList[i].Qtt;
                    }
                }
            }
        }
    }
})













//Ajouter via la liste (addToCart)
.post('/ajouterCart', urlencodedParser, function(req, res) {

    let tr = false;
    let qttOnItem = 0;
    let cpt = 0;

    console.log('hhahahahah');
    console.log(req.body.CodeProdCart);

    let query = { Code: req.body.CodeProdCart };

    if (req.session.ticketList.length == 0) { //si pas d'item dans la liste

        //on cherhe le produit dans la BDD et on l'ajoute le produit dans la liste
        EventProduct.find(query, function(err, products) {

            if (err) throw err;

            const prod = {
                Name: products[0].Name,
                Price: products[0].Price,
                Avatar: products[0].avatar,
                Code: products[0].Code,
                Qtt: products[0].Qtt,
                qttOnItem: qttOnItem + 1,
                cpt: cpt + 1
            };

            req.session.ticketSubTotal = req.session.ticketSubTotal + products[0].Price;
            req.session.ticketTotal = req.session.ticketSubTotal;
            req.session.ticketList.push(prod);
            req.session.ticketItem = req.session.ticketItem + 1;
            res.redirect('/pos');

        })

    } else { //si pas premier produit , faut tester esq le produit est déja ou non dans la liste 

        var ind;

        console.log('jhahjajaja')
        for (let i = 0, l = req.session.ticketList.length; i < l; i++) {

            console.log(req.session.ticketList[i])
            if (req.session.ticketList[i].Code == req.body.CodeProdCart) { //si le produit existe déja tr = true
                console.log('trouvéé')
                tr = true;
                ind = i; //on récupére l'index du produit
            }
        }

        // req.session.ticketList.forEach(function(value, index, array){       
        // })

        console.log('index');
        console.log(ind);

        if (tr == false) { //le produit n'esxite pas encore il faut l'ajouter  (si tr = false)

            EventProduct.find(query, function(err, products) {
                if (err) throw err;

                const prod = {
                    Name: products[0].Name,
                    Price: products[0].Price,
                    Avatar: products[0].avatar,
                    Code: products[0].Code,
                    Qtt: products[0].Qtt,
                    qttOnItem: qttOnItem + 1,
                    cpt: cpt + 1
                };


                req.session.ticketSubTotal = req.session.ticketSubTotal + products[0].Price;
                req.session.ticketTotal = req.session.ticketSubTotal;
                req.session.ticketList.push(prod);
                req.session.ticketItem = req.session.ticketItem + 1;
                res.redirect('/pos');

            })

            //si le produit existe dans la liste il ne faut pas le dupliquer 
        } else if (tr == true) {

            console.log('le produit existe déja')


            //on incrémente le prix au niveau du ticket et on décrémente la qtt de 1
            for (let i = 0, l = req.session.ticketList.length; i < l; i++) {

                console.log('index = ind')
                console.log(ind)
                console.log(i)
                console.log(req.session.ticketList[i].Code)

                if (i == ind) { //si le produit existe déja tr = true

                    EventProduct.find({ Code: req.session.ticketList[i].Code }, function(err, products) {
                        if (err) throw err;
                        if (!products.length) {
                            console.log("Ce produit n'existe pas");
                            res.redirect('/pos');
                        } else {
                            req.session.ticketSubTotal = req.session.ticketSubTotal + products[0].Price;
                            req.session.ticketTotal = req.session.ticketSubTotal;
                            console.log(req.session.ticketList[i].Price);
                            console.log('iiiiiiii')

                            req.session.ticketList[i].Price = req.session.ticketList[i].Price + products[0].Price;

                            req.session.ticketList[i].Qtt = req.session.ticketList[i].Qtt - 1;
                            req.session.ticketList[i].qttOnItem = req.session.ticketList[i].qttOnItem + 1
                            req.session.ticketList[i].cpt = req.session.ticketList[i].cpt + 1;

                            console.log(req.session.ticketList[i].Price);
                            //chercher le produit à ajouter dans la bdd

                            console.log('total = ')
                            res.redirect('/pos');
                        }

                    })

                } else {
                    req.session.ticketList[i].Price = req.session.ticketList[i].Price;
                    req.session.ticketList[i].Qtt = req.session.ticketList[i].Qtt;
                }
            }
        }
    }
})











/* Supprime un élément de la list */
.get('/supprimer/:id/:prix/:qttOnP', isAuthenticated, function(req, res) {

    console.log('suppression effectuée avec succées');

    if (req.params.id != '') {
        req.session.ticketList.splice(req.params.id, 1);
        req.session.ticketItem = req.session.ticketItem - 1;

        let qttP = req.params.qttOnP;
        let prixP = req.params.prix;
        console.log('prix');
        console.log(prixP);

        console.log(req.session.ticketSubTotal);
        req.session.ticketSubTotal = req.session.ticketSubTotal - prixP;
        req.session.ticketTotal = req.session.ticketSubTotal;
    }

    res.redirect('/pos');
})




//Enregistrer le ticket (soustraire la qtt des produit et impimer le ticket)
.post('/enregistrer/', function(req, res) {

    req.session.ticketList.forEach(function(value, index, array) {
        console.log(value.Name);

        if (value.Qtt != 0) {

            let query = { Code: value.Code };
            let quantiter = value.Qtt - 1;

            EventProduct.updateOne(query, { $set: { "Qtt": quantiter } }, function(err, products) {

                if (!err) {
                    console.log('la modification a bien marché'); //message vert de confirmation
                } else {
                    console.log(err)
                }
            })

        } else {
            console.log("rupture de stock de se produit")
        }
    });

    //on remet tout à zero
    req.session.ticketList = [];
    req.session.ticketSubTotal = 0;
    req.session.ticketItem = 0;
    req.session.ticketTotal = 0;
    req.session.remisePrcentage = 0;
    req.session.remisePoint = 0;

    res.redirect('/pos');
})



//Ajouter le pourcentage de remise si le client a acheter assez de produits
.post('/remise', function(req, res) {

    if (req.body.champsRemise == '') {
        console.log('Champs remise Vide');

    } else if (req.session.ticketSubTotal == 0) {
        console.log('pas de produit dans le ticket');

    } else {

        console.log(req.body.champsRemise);
        let quer = req.body.champsRemise;

        let subT = req.session.ticketSubTotal;
        EventClient.find({ codeClient: quer }, function(err, produc) {
            if (err) {
                console.log('Une erreur c poduite');
            }
            if (!produc.length) {
                console.log('Ce client existe pas dans la BDD');
            } else {

                if (req.session.ticketSubTotal < 1000) {
                    console.log('Pas de remise car total <= 1000 Da');
                    req.session.ticketTotal = req.session.ticketSubTotal;
                    req.session.remisePrcentage = 0;
                    req.session.remisePoint = ((req.session.ticketSubTotal * 10) / 100);

                } else if (req.session.ticketSubTotal < 2000) {
                    req.session.ticketTotal = (req.session.ticketSubTotal - (req.session.ticketSubTotal * 2) / 100);
                    req.session.remisePrcentage = 2;
                    req.session.remisePoint = ((req.session.ticketSubTotal * 10) / 100);

                } else if (req.session.ticketSubTotal < 3000) {
                    req.session.ticketTotal = (req.session.ticketSubTotal - (req.session.ticketSubTotal * 3) / 100);
                    req.session.remisePrcentage = 3;
                    req.session.remisePoint = ((req.session.ticketSubTotal * 10) / 100);

                } else if (req.session.ticketSubTotal < 4000) {
                    req.session.ticketTotal = (req.session.ticketSubTotal - (req.session.ticketSubTotal * 4) / 100);
                    req.session.remisePrcentage = 4;
                    req.session.remisePoint = ((req.session.ticketSubTotal * 10) / 100);

                } else if (req.session.ticketSubTotal < 5000) {
                    req.session.ticketTotal = (req.session.ticketSubTotal - (req.session.ticketSubTotal * 5) / 100);
                    req.session.remisePrcentage = 5;
                    req.session.remisePoint = ((req.session.ticketSubTotal * 10) / 100);

                } else if (req.session.ticketSubTotal >= 5000) {
                    req.session.ticketTotal = (req.session.ticketSubTotal - (req.session.ticketSubTotal * 6) / 100);
                    req.session.remisePrcentage = 6;
                    req.session.remisePoint = ((req.session.ticketSubTotal * 10) / 100);
                }
            }
            res.redirect('/pos');
        })

    }
})




//Annuler le ticket (mettre tout à zero)
.post('/annuler', function(req, res) {
    req.session.ticketList = [];
    req.session.ticketSubTotal = 0;
    req.session.ticketItem = 0;
    req.session.ticketTotal = 0;
    req.session.remisePrcentage = 0;
    req.session.remisePoint = 0;
    res.redirect('/pos');
})












.post('/modifierQtt', urlencodedParser, function(req, res) {


    let tr = false;
    let qttOnItem = 0;
    let prix = 0;

    console.log('hhahahahah');
    console.log('le produit existe déja')
    console.log(req.body.CodePro);
    console.log(req.body.qttDuProdItem);

    let query = { Code: req.body.CodePro };
    let qtOnItem = req.body.qttDuProdItem;
    let cp = req.body.cptQtt;

    console.log('cpt');
    console.log(req.body.cptQtt)

    var ind;

    console.log('jhahjajaja')
    for (let i = 0, l = req.session.ticketList.length; i < l; i++) {

        console.log(req.session.ticketList[i])
        if (req.session.ticketList[i].Code == req.body.CodePro) { //si le produit existe déja tr = true
            console.log('trouvéé')
            tr = true;
            ind = i; //on récupére l'index du produit
        }
    }

    console.log('index');
    console.log(ind);

    if (tr == true) {

        console.log('le produit existe déja')


        //on incrémente le prix au niveau du ticket et on décrémente la qtt de 1
        for (let i = 0, l = req.session.ticketList.length; i < l; i++) {

            console.log('index = ind')
            console.log(ind)
            console.log(i)
            console.log(req.session.ticketList[i].Code)

            if (i == ind) { //si le produit existe déja tr = true

                EventProduct.find({ Code: req.session.ticketList[i].Code }, function(err, products) {
                    if (err) throw err;
                    if (!products.length) {
                        console.log("Ce produit n'existe pas");
                        res.redirect('/pos');
                    } else {









                        console.log('iiiiiiii')
                        console.log(qtOnItem)
                        console.log(req.session.ticketList[i].cpt)

                        req.session.ticketList[i].Price = (products[0].Price * qtOnItem);

                        if (req.session.ticketList[i].cpt >= qtOnItem) {
                            prix = req.session.ticketList[i].cpt - qtOnItem;
                            req.session.ticketList[i].Qtt = req.session.ticketList[i].Qtt + prix;

                            req.session.ticketSubTotal = req.session.ticketSubTotal - (prix * products[0].Price);
                            req.session.ticketTotal = req.session.ticketSubTotal;
                        }
                        if (req.session.ticketList[i].cpt < qtOnItem) {
                            prix = qtOnItem - req.session.ticketList[i].cpt
                            req.session.ticketList[i].Qtt = req.session.ticketList[i].Qtt - prix;

                            req.session.ticketSubTotal = req.session.ticketSubTotal + (prix * products[0].Price);
                            req.session.ticketTotal = req.session.ticketSubTotal;
                        }





                        req.session.ticketList[i].qttOnItem = qtOnItem //afficher la qtt dans le ticket aprés actualisation de la page
                        req.session.ticketList[i].cpt = qtOnItem;

                        console.log('total = ')
                        res.redirect('/pos');
                    }

                })

            } else {
                req.session.ticketList[i].Price = req.session.ticketList[i].Price;
                req.session.ticketList[i].Qtt = req.session.ticketList[i].Qtt;
            }
        }
    }

})





/* On redirige vers la list si la page demandée n'est pas trouvée */
.use(function(req, res, next) {
    res.redirect('/pos');
})





module.exports = router;