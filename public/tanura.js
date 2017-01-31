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
    url: /.*\//.exec(document.currentScript.src)[0],
    options: null,
    eventHandler: {
        events: {
            init: []
        }
    },
    nuve: null,
    erizo: null,
    whiteboard: null
};

/**
 * Initialize Tanura.
 */
tanura.init = (_, f) => {
    tanura.options = _ || {};
    if (f) { tanura.eventHandler.events.init.push(f); }

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
})()

