'use strict';

var debug = require('debug')('tanura:nuve');
var express = require('express');

var nuve = require('../nuve');
var config = require('../licode_config');

/*
 * Nuve routes.
 *
 * This defines the route necessary to communicate with the Nuve backend
 */

/**
 * The router for this module.
 */
var router = express.Router();

/**
 * The room this instance of Tanura is connected to.
 *
 * TODO Multiroom-support.
 */
var myRoom;

// Initialize the communication layer for the Nuve backend.
nuve.API.init(
        config.nuve.superserviceID,
        config.nuve.superserviceKey,
        'http://licode:3000/');

// Find the room called "default", creating it if it does not exist and store 
// its ID.
nuve.API.getRooms(function(roomlist) {
    var rooms = JSON.parse(roomlist);
    for (var i in rooms) {
        if (rooms[i].name === 'default'){
            myRoom = rooms[i]._id;
        }
    }
    if (!myRoom) {
        nuve.API.createRoom('default', function(room) {
            myRoom = room._id;
            debug('Created room ' + myRoom);
        });
    } else {
        debug('Using room ' + myRoom);
    }
});

// GET a list of rooms.
router.get('/getRooms/', function(req, res) {
    nuve.API.getRooms(function(rooms) {
        res.send(rooms);
    });
});

// GET the users in a specific room.
router.get('/getUsers/:room', function(req, res) {
    var room = req.params.room;
    nuve.API.getUsers(room, function(users) {
        res.send(users);
    });
});

// POST Access info. This should check whether the client is allowed in and 
// return a token if so. Currently no permission checking is implemented.
router.post('/createToken/', function(req, res) {
    var room = myRoom;
    var username = req.body.username;
    var role = req.body.role;
    nuve.API.createToken(myRoom, username, role, function(token) {
        res.send(token);
    }, function(error) {
        debug(error);
        res.status(503).send('No Erizo controller found');
    });
});

module.exports = router;

