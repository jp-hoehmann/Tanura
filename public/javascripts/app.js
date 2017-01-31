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
tanura.eventHandler.check = function(x) {
    return !! this[x] && Array.isArray(this[x]);
}.bind(tanura.eventHandler.events)

/*
 * Safely perform something on an event.
 *
 * This will check if a given event exists and call a given function on it, if 
 * it does. The return value indicates if the event was found.
 */
tanura.eventHandler.safe = function(x, f) {
    return this.check(x) && ! f(this.events[x]) || true;
}.bind(tanura.eventHandler)

/*
 * Fire an event.
 *
 * When given an event name, this function will run all callbacks for that 
 * event. Exit is true on success, false otherwise.
 */
tanura.eventHandler.fire = (x) =>
    tanura.eventHandler.safe(x, (_) => _.forEach((i) => i()));

/*
 * Register a callback for an event.
 *
 * This will add a function to be called whenever a given event occurs. Exit is 
 * true on success, false otherwise.
 */
tanura.eventHandler.register = (x, f) =>
    tanura.eventHandler.safe(x, (_) => _.push(f));

