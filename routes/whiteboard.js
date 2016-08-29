"use strict";

var debug = require('debug')('tanura:whiteboard');

var express = require('express');
var router = express.Router();

var mongo = require('mongodb').MongoClient;
var database;
var collection;

// Check request validity.
var requestValid = function(name, res) {
    if (/^[\w-]*$/.test(name)) {
        debug('Whiteboard name is valid');
        return true;
    } else {
        debug('Encountered malformed whiteboard request');
        res.status(400).send('Malformed parameter');
        return false;
    }
}

mongo.connect("mongodb://localhost:27017", function(err, db) {
    if (err) {
        debug('Database connection failed! Error: ' + err);
    } else {
        database = db;
        collection = db.collection('whiteboard');
        debug('Connected to database');
    }
});

/*
// Fetch a stored whiteboard.
router.post('/get/', function(req, res) {
    var name = req.body.name;

    debug('Getting whiteboard "' + name + '"');
    if (requestValid(name, res)) {
        collection.findOne({name: name}, function(err, item) {
            if (err) {
                debug('Could not find whiteboard');
            } else {
                debug('Got whiteboard');
            }
            debug(item);
            res.end(JSON.stringify(item || {}));
        });
    }
});
*/

// Store a whiteboard.
router.post('/set/', function(req, res) {
    var name = req.body.name;
    var snapshot = req.body.data;

    debug('Setting whiteboard "' + name + '"');
    if (requestValid(name, res)) {
        collection.update(
                {name: name}, 
                {name: name , data: snapshot}, 
                {w: 1, usert: true},
                function(err, res) {
                    if (err) {
                        debug('Error setting whiteboard: ' + err);
                    } else {
                        debug('Set whiteboard');
                    }
                });
        res.send("");
    }
});

module.exports = router;

