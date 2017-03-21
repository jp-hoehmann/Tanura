'use strict';

/*
 * Helper functions.
 *
 * This script contains miscellaneous helpers, that implement functionality, 
 * that is not specific to this project.
 */

((_) => {

    /*
     * Log something.
     */
    _.log = ((_) => (a) => console.log("[" + _ + "] " + a))(_.info.name);

    /*
     * Throttle an event.
     *
     * This will limit the rate of a DOM event, to allow attaching heavier 
     * handlers.
     */
    _.throttle = (type, name, obj) => {
        obj = obj || window;
        var running = false;
        var f = () => {
            if (running) { return; }
            running = true;
            requestAnimationFrame(() => {
                obj.dispatchEvent(new CustomEvent(name));
                running = false;
            });
        };
        obj.addEventListener(type, f);
    }

})(tanura);
