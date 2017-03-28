'use strict';

/*
 * Bootstrap Tanura.
 *
 * This script will bootstrap Tanura into an application.
 */

/**
 * Globally available information about Tanura.
 *
 * This object contains information about Tanura, that is available to the 
 * hosting website.
 */
var tanura = {
    erizo: null,
    eventHandler: {
        events: {
            client_initialized: [],
            client_loaded: [],
            client_resized: [],
            connection_closed: [],
            connection_failed: [],
            connection_opened: [],
            data_received: [],
            media_denied: [],
            media_denied_fallback: [],
            media_denied_preferred: [],
            media_granted: [],
            media_granted_fallback: [],
            media_granted_preferred: [],
            stream_added: [],
            stream_added_local: [],
            stream_added_remote: [],
            stream_failed: [],
            stream_failed_local: [],
            stream_failed_remote: [],
            stream_removed: [],
            stream_removed_local: [],
            stream_removed_remote: [],
            stream_throttled: [],
            stream_throttled_local: [],
            stream_throttled_remote: [],
            whiteboard_changed: [],
            whiteboard_cleared: [],
            whiteboard_created: [],
            whiteboard_edited: [],
            whiteboard_initialized: [],
            whiteboard_loaded: [],
            whiteboard_updated: []
        }
    },
    info: {
        name: "Tanura",
        version: "0.1.0"
    },
    nuve: null,
    options: null,
    url: /.*\//.exec(document.currentScript.src)[0],
    whiteboard: null
};

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
tanura.eventHandler.fire = (_, x) => {
    tanura.log("Event: " + _);
    return tanura.eventHandler.safe(_, (_) => _.forEach((i) => i(x)));
}

/*
 * Register a callback for an event.
 *
 * This will add a function to be called whenever a given event occurs.  Exit is 
 * true on success, false otherwise.  If an additional parameter is provided, 
 * the callback is bound to it, otherwise it will be bound to Tanura.
 */
tanura.eventHandler.register = (_, f, x) =>
    tanura.eventHandler.safe(_, (_) => _.push(f.bind(x || tanura)));

/**
 * Initialize Tanura.
 *
 * This will initialize Tanura, optionally accepting callback and configuration.
 */
tanura.init = (f, o, x) => {
    tanura.options = o || {};
    if (f) {
        tanura.eventHandler.events.client_initialized.push(f.bind(x || tanura));
    }

    // Start Tanura, if everything is loaded already. If Tanura is still 
    // loading, it will automatically launch when ready.
    if (tanura.run) { tanura.run(); }
}

(function() {
    var request = new XMLHttpRequest();
    request.addEventListener('load', function() {
        var replaceScriptNodes = node => {
            if (node.tagName === 'SCRIPT') {
                var script  = document.createElement('script');
                script.text = node.innerHTML;
                for(var i = node.attributes.length - 1; i >= 0; i--) {
                    script.setAttribute(
                        node.attributes[i].name, node.attributes[i].value);
                }
                node.parentNode.replaceChild(script, node);
            } else {
                var childs = node.childNodes;
                for (var i = 0; i < childs.length; i++) {
                    replaceScriptNodes(childs[i]);
                }
            }
        }

        document.getElementsByTagName('body')[0].innerHTML += this.responseText;

        // Regenerate all script nodes in the new content, since they will not 
        // be loaded otherwise.
        replaceScriptNodes(document.getElementById('tanura-src'));
    });
    request.responseType = 'text';
    request.open(
        'GET', tanura.url + 'tanura.html.frag?base=' + tanura.url);
    request.send();
})();

