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
let router = express.Router();

/**
 * The room to connect to by default.
 */
const defaultRoomName = 'default';

/**
 * The app name to use to mark rooms as owned by Tanura.
 */
const appName = 'tanura';

/**
 * The default room.
 */
let defaultRoomId;

/**
 * Get a room, creating it, if it does not exist yet.
 */
const getOrCreateRoom = (name, type = 'erizo', mediaConfiguration = 'default', callback = () => {}) => {
    if (name === defaultRoomName && defaultRoomId) {
        callback(defaultRoomId);
        return;
    }

    nuve.API.getRooms((roomlist) => {
        let theRoom = '';
        const rooms = JSON.parse(roomlist);
        for (let i = 0; i < rooms.length; i += 1) {
            const room = rooms[i];
            if (room.name === name && room.data && room.data.app === 'tanura') {
                theRoom = room._id;
                callback(theRoom);
                return;
            }
        }
        const extra = {
            data: { app: appName },
            mediaConfiguration
        }

        nuve.API.createRoom(name, (room) => {
            theRoom = room._id;
            callback(theRoom);
        }, () => {}, extra);
    });
};

/**
 * Delete the empty ones from a list of rooms.
 */
const deleteRoomsIfEmpty = (theRooms, callback) => {
    if (theRooms.length === 0) {
        callback(true);
        return;
    }
    const theRoomId = theRooms.pop()._id;
    nuve.API.getUsers(theRoomId, (userlist) => {
        const users = JSON.parse(userlist);
        if (Object.keys(users).length === 0) {
            nuve.API.deleteRoom(theRoomId, () => {
                deleteRoomsIfEmpty(theRooms, callback);
            });
        } else {
            deleteRoomsIfEmpty(theRooms, callback);
        }
    }, (error, status) => {
        console.log('Error getting user list for room ', theRoomId, 'reason: ', error);
        switch (status) {
            case 404:
                deleteRoomsIfEmpty(theRooms, callback);
                break;
            case 503:
                nuve.API.deleteRoom(theRoomId, () => {
                    deleteRoomsIfEmpty(theRooms, callback);
                });
                break;
            default:
                break;
        }
    });
};

/**
 * Remove all empty rooms owned by Tanura, except for the default room.
 */
const cleanRooms = (callback) => {
    console.log('Cleaning Tanura rooms');
    nuve.API.getRooms((roomlist) => {
        const rooms = JSON.parse(roomlist);
        const roomsToCheck = [];
        rooms.forEach((aRoom) => {
            if (aRoom.data && aRoom.data.app === appName && aRoom.name !== defaultRoomName) {
                roomsToCheck.push(aRoom);
            }
        });
        deleteRoomsIfEmpty(roomsToCheck, () => {
            callback('done');
        });
    }, (err) => {
        console.log('Error cleaning example rooms', err);
        setTimeout(cleanRooms.bind(this, callback), 3000);
    });
};

// Initialize the communication layer for the Nuve backend.
nuve.API.init(
        config.nuve.superserviceID,
        config.nuve.superserviceKey,
        'http://licode:3000/');

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
    const username = req.body.username;
    const role = req.body.role;
    const room = req.body.room || defaultRoomName;
    const type = req.body.type || null;
    const roomId = req.body.roomId || null;
    const mediaConfiguration = req.body.mediaConfiguration || null;

    const createToken = (roomId) => {
        nuve.API.createToken(roomId, username, role, function (token) {
            res.send(token);
        }, function (error) {
            debug(error);
            res.status(503).send('No Erizo controller found');
        });
    };

    if (roomId) {
        createToken(roomId);
    } else {
        getOrCreateRoom(room, type, mediaConfiguration, createToken);
    }
});

cleanRooms(() => {
    getOrCreateRoom(defaultRoomName, undefined, undefined, (roomId) => {
        defaultRoomId = roomId;
        console.log('Tanura started');
    });
});

module.exports = router;
