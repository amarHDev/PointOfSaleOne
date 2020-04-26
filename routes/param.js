const express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('layouts/param', {
        title: 'Paramètres',
        style: 'dashboard.css',
        style2: 'style2.css',
        style3:'product.css',
        JS1: 'search.js'
    })
})

module.exports = router;