'use strict';

/*
 * Tanura internal library.
 *
 * This script defines plumbing specific to Tanura, that is not meant for use by 
 * the end-user.
 */

(function() {

    /*
     * Group a list of events into another event.
     *
     * This will fire a given event whenever an event from a given list fires.  
     * The return value will be true, if the grouping succeeded, false 
     * otherwise. If the grouping fails due to some of the grouped events not 
     * existing the rest will still be grouped.
     */
    var groupEvents = function(_, l) {
        var r = true;
        for (var i of l) {
            if (! this.register(i, function(x) {
                return this.fire(_, x);
            }, this)) { r = false; }
        }
        return r;
    }.bind(tanura.eventHandler);

    groupEvents(
            'media_granted',
            ['media_granted_preferred', 'media_granted_fallback']);

})();

