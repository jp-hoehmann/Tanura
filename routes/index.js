'use strict';

var express = require('express');

/*
 * Main page.
 *
 * This defines the route used to initially fetch the app.
 */

/**
 * The router for this module.
 */
var router = express.Router();

// GET the demo app.
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Test Page' });
});

// GET the HTML fragment listing all required scripts and style sheets.
router.get('/tanura.html.frag', function(req, res, next) {
    res.render('bootstrap', {});
});

module.exports = router;

