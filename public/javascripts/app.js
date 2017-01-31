'use strict';

/*
 * Tanura main script.
 *
 * This script defines Tanura's high level features.
 */

/*
 * Fire an event.
 *
 * When given an event name, this function will run all callbacks for that 
 * event. Exit is true on success, false otherwise.
 */
tanura.eventHandler.fire = (x) =>
    ((_) =>
        ! (! _[x]
            || ! _[x].forEach
            || _[x].forEach((i) => i())))(tanura.eventHandler.events);

