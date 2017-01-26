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
        {video: true},
        () => { console.log("Initialized."); });
}

