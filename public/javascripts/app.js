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

/*
 * Register a callback for an event.
 *
 * This will add a function to be called whenever a given event occurs. Exit is 
 * true on success, false otherwise.
 */
tanura.eventHandler.register = (x, f) =>
    ((_) =>
        ! (! _[x] || ! _[x].push || _[x].push(f)))(tanura.eventHandler.events);

