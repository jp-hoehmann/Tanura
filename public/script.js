'use strict';

/*
 * Tanura demo app.
 *
 * This is the main script of the app demonstrating Tanura's features.
 */

/**
 * Bootstrapping routine.
 */
window.onload = () => {
    console.log("Initializing Tanura...");
    tanura.init(
        () => {
            console.log("Initialized.");

            // Example of how to handle Tanura's internally generated events.
            tanura.eventHandler.register(
                    'client_resized',
                    () => console.log("Caught a resize."));
        },
        {video: true});
}

