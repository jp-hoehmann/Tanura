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
tanura.eventHandler.check = function(_) {
    return !! this[_] && Array.isArray(this[_]);
}.bind(tanura.eventHandler.events)

/*
 * Safely perform something on an event.
 *
 * This will check if a given event exists and call a given function on it, if 
 * it does. The return value indicates if the event was found.
 */
tanura.eventHandler.safe = function(_, f) {
    return this.check(_) && ! f(this.events[_]) || true;
}.bind(tanura.eventHandler)

/*
 * Fire an event.
 *
 * When given an event name, this function will run all callbacks for that 
 * event. A single parameter for the callback may be passed. Exit is true on 
 * success, false otherwise.
 */
tanura.eventHandler.fire = (_, x) =>
    tanura.eventHandler.safe(_, (_) => _.forEach((i) => i(x)));

/*
 * Register a callback for an event.
 *
 * This will add a function to be called whenever a given event occurs.  Exit is 
 * true on success, false otherwise.  If an additional parameter is provided, 
 * the callback is bound to it, otherwise it will be bound to Tanura.
 */
tanura.eventHandler.register = (_, f, x) =>
    tanura.eventHandler.safe(_, (_) => _.push(f.bind(x || tanura)));

