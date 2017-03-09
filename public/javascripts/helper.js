'use strict';

/*
 * Helper functions.
 *
 * This script contains miscellaneous helpers, that implement functionality, 
 * that is not specific to this project.
 */

(() => {

    var _ = tanura;

    /*
     * Log something.
     */
    _.log = ((_) => (x) => console.log("[" + _ + "] " + x))(_.info.name);

})();
