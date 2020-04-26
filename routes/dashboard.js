const express = require('express');
var router = express.Router();



isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) return next()
    res.redirect('/')
}
router.get('/', isAuthenticated, function(req, res) {

    res.render('layouts/dashboard', {
        title: 'Dashboard',
        style: 'dashboard.css'
    });
});

module.exports = router;