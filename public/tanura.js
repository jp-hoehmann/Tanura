'use strict';

/*
 * Bootstrap Tanura.
 *
 * This script will bootstrap Tanura into an application.
 */

(function() {
    var baseUrl = /.*\//.exec(document.currentScript.src)[0];
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
        'GET', baseUrl + 'tanura.html.frag?base=' + baseUrl);
    request.send();
})()
