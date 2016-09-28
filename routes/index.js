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

// GET the app.
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Test Page' });
});

module.exports = router;

