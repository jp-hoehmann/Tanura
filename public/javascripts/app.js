'use strict';

/*
 * Tanura main script.
 *
 * This script defines Tanura's high level features.
 */

/*
 * Check if an event exists.
 *
 * When given an event name, this function will check, if there is an entry in 
 * tanura.eventHandler.events for that name, that has the methods required.
 */
tanura.eventHandler.check = (x) =>
    ((_) => !! _[x] && Array.isArray(_[x]))(tanura.eventHandler.events);

/*
 * Fire an event.
 *
 * When given an event name, this function will run all callbacks for that 
 * event. Exit is true on success, false otherwise.
 */
tanura.eventHandler.fire = (x) =>
    tanura.eventHandler.check(x)
        && ! tanura.eventHandler.events[x].forEach((i) => i());

/*
 * Register a callback for an event.
 *
 * This will add a function to be called whenever a given event occurs. Exit is 
 * true on success, false otherwise.
 */
tanura.eventHandler.register = (x, f) =>
    tanura.eventHandler.check(x) && ! tanura.eventHandler.events[x].push(f);

