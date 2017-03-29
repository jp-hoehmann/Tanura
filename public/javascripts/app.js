'use strict';

/*
 * Tanura built-in behavior.
 *
 * This script defines Tanura's business logic in the form of built-in routines 
 * for handling certain events.
 */

(function() {

    /*
     * Handling for whiteboard_edited.  This will automagically push whiteboard 
     * edits to all other participants.
     */
    tanura.eventHandler.register('whiteboard_edited', function(_) {
        return this.erizo.localStream.sendData({type: 'canvas-draw', data: _});
    });

})()

