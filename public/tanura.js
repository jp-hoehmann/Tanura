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
            client_resized: [],
            data_received: [],
            fallbackmedia_denied: [],
            fallbackmedia_granted: [],
            localstream_connected: [],
            localstream_denied: [],
            localstream_failed: [],
            localstream_granted: [],
            media_denied: [],
            media_granted: [],
            room_connected: [],
            room_connecting: [],
            stream_added: [],
            stream_opened: [],
            stream_removed: [],
            stream_throttled: [],
            whiteboard_changed: [],
            whiteboard_cleared: [],
            whiteboard_created: [],
            whiteboard_edited: [],
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

