'use strict';

/*
 * Helper for throttling resize events.
 *
 * As Tanura may have to do quite heavy lifting upon resize of the browser 
 * window, depending on usage, this will add a new event, that will also occur 
 * on resizes, but is rate-limited.
 */

// developer.mozilla.org/de/docs/Web/Events/resize
;(function() {
    var throttle = function(type, name, obj) {
        obj = obj || window;
        var running = false;
        var func = function() {
            if (running) { return; }
            running = true;
            requestAnimationFrame(function() {
                obj.dispatchEvent(new CustomEvent(name));
                running = false;
            });
        };
        obj.addEventListener(type, func);
    };
    throttle('resize', 'throttledResize');
})();

