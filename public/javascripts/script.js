'use strict';

var nuveUrl = '/nuve/';
var whiteboardUrl = '/whiteboard/';
var room;
var localStream;
var canvas;
var fakeResize = false;
var streamOpts = {
    audio: true, 
    video: true,
    data: true,
    screen: false,
    videoSize: [384, 384, 384, 384]
};
var fallbackStreamOpts = {
    audio: false,
    video: false,
    data: true,
    screen: false,
};

// Set a color scheme.
var colorize = (colorScheme) => {
    var e = document.getElementsByTagName('nav')[0];
    e.style.backgroundColor = '#' + colorScheme[1];
    e.className = colorScheme[2] ? 'inverted' : '';
}

// Initialise the whiteboard.
var mkCanvas = (snapshot) => {
    canvas = LC.init(
            document.getElementById('whiteboard'), 
            {snapshot: snapshot});
    canvas.setTool(new LC.tools.Pencil(canvas));
    canvas.on('drawEnd', () => localStream.sendData({
        type: 'canvas-draw',
        data: canvas.getSnapshot()
    }));
}

window.onload = () => {
    var body = document.getElementsByTagName('body')[0];
    var leftBtn = document.getElementById('left-btn');
    var rightBtn = document.getElementById('right-btn');

    // Manually calculate the size of some elements to work around flexbox 
    // issues and limitations.
    var f = () => {
        if (!fakeResize) {
            document.getElementById('content').style.height
                = window.innerHeight 
                - document.getElementsByTagName('nav')[0].offsetHeight 
                + 'px';

            // Wait for transitions.
            setTimeout(() => {
                var e = document.getElementById('main');
                var _ = document.getElementById('presentation');
                if (innerWidth > innerHeight) {
                    _.style.height = '100%';
                    _.style.width = '0';
                    _.style.width = e.clientWidth - 224 + 'px';
                } else {
                    _.style.width = '100%';
                    _.style.height = '0';
                    _.style.height = e.clientHeight - 224 + 'px';
                }

                // Pass another resize for Literallycanvas.
                fakeResize = true;
                dispatchEvent(new Event('resize'));
            }, 200);
        } else {
            fakeResize = false;
        }
    }

    /* setTimeout to wait for the animations. */
    window.addEventListener('throttledResize', f);

    f();

    leftBtn.addEventListener(
            'click', 
            () => {
                body.classList.toggle('left-expanded');
                dispatchEvent(new Event('resize'));
            });
    rightBtn.addEventListener(
            'click', 
            () => {
                body.classList.toggle('right-expanded');
                dispatchEvent(new Event('resize'));
            });
    document.getElementById('back-btn').addEventListener(
            'click', 
            () => body.className = '');
    document.getElementById('users-btn').addEventListener(
            'click', 
            () => {
                document
                    .getElementsByTagName('main')[0]
                    .classList
                    .toggle('listview');
            });

    // If on mobile clicking in the center area will close any <aside>s.
    var _ = document.getElementsByClassName('center');
    for (var i = 0; i < _.length; i++) {
        _[i].addEventListener(
                'click',
                (_) => {
                    if (body.className != '' && window.innerWidth <= 600) {
                        body.className = '';
                        leftBtn.classList.remove('active');
                        rightBtn.classList.remove('active');
                        _.stopPropagation();
                    }
                    else if (body.classList.contains('right-expanded') 
                            && window.innerWidth <= 1280) {
                        body.classList.remove('right-expanded');
                        rightBtn.classList.remove('active');
                        _.stopPropagation();
                    }
                },
                true);
    }

    // Clicking a button will toggle its active state.
    var _ = document.getElementsByClassName('toggle-btn');
    for (var i = 0; i < _.length; i++) {
        _[i].addEventListener('click', 
                (_) => _.currentTarget.classList.toggle('active'));
    }

    // List of color schemes.
    var colors = [
        ['Red', 'f44336', true],
        ['Pink', 'e91e63', true],
        ['Purple', '9c27b0', true],
        ['Deep Purple', '673ab7', true],
        ['Indigo', '3f51b5', true],
        ['Blue', '2196f3', true],
        ['Light Blue', '03a9f4', false],
        ['Cyan', '00bcd4', false],
        ['Teal', '009688', true],
        ['Green', '4caf50', false],
        ['Light Green', '8bc34a', false],
        ['Lime', 'cddc39', false],
        ['Yellow', 'ffeb3b', false],
        ['Amber', 'ffc107', false],
        ['Orange', 'ff9800', false],
        ['Deep Orange', 'ff5722', true],
        ['Brown', '795548', true],
        ['Blue Grey', '607d8b', true]];

    // Add buttons for the color schemes.
    for (var i = 0; i < colors.length; i++) {
        var _ = document.createElement('a');
        _.textContent = colors[i][0];
        _.addEventListener(
                'click',
                ((_) => () => { 
                    colorize(_);
                    localStorage.setItem('colorScheme', JSON.stringify(_));
                })(colors[i]));
        var e = document.createElement('p');
        document.getElementById('colors').appendChild(e);
        e.appendChild(_);
    }

    document.getElementById('presentation-toggle').addEventListener('click', () => {
        document.getElementById('presentation-toggle').textContent 
            = document.getElementById('presentation').classList.toggle('hidden')
            ? 'Open whiteboard' : 'Close whiteboard';
        dispatchEvent(new Event('resize'));
    });
    document
        .getElementById('whiteboard-clear')
        .addEventListener('click', () => {
            canvas.clear();
            localStream.sendData({type: 'canvas-clear'})
        });
    /*
    document
        .getElementById('whiteboard-load')
        .addEventListener('click', () => {
            var req = new XMLHttpRequest();
            req.addEventListener('load', function() {
                var snapshot = JSON.parse(this.responseText);
                canvas.loadSnapshot(snapshot);
                localStream.sendData({type: 'canvas-draw', data: snapshot});
            });
            req.open('POST', whiteboardUrl + 'get/', true);
            req.setRequestHeader('Content-Type', 'application/json');
            req.send(JSON.stringify({name: 'default'}));
        });
    */
    document
        .getElementById('whiteboard-store')
        .addEventListener('click', () => {
            var req = new XMLHttpRequest();
            req.open('POST', whiteboardUrl + 'set/', true);
            req.setRequestHeader('Content-Type', 'application/json');
            req.send(JSON.stringify({
                name: 'default', 
                data: canvas.getSnapshot() 
            }));
        });

    // Fetch color scheme.
    var _ = localStorage.getItem('colorScheme');
    if (_) { colorize(JSON.parse(_)); }

    // Prepare a request for a room token.
    var req = new XMLHttpRequest();
    req.addEventListener('load', function() {
        var token = this.responseText;
        console.log(token);
        room = Erizo.Room({token: token});
        
        var join = function() {

            // Add a single stream to the DOM.
            var addStream = function(stream, options) {
                if (stream.hasVideo()) {
                    var videoEntry = document.createElement('div');
                    videoEntry.setAttribute('id', 'videoEntry_' + stream.getID());
                    document.getElementById('people').appendChild(videoEntry);
                    stream.show('videoEntry_' + stream.getID(), options);
                }
            };

            // Subscribe to a list of streams.
            var subscribeToStreams = function(streams) {
                for (var i in streams) {
                    room.subscribe(streams[i]);
                    streams[i].addEventListener('bandwidth-alert', function(e) {
                        console.log('Bandwidth Alert', e.msg, e.bandwidth);
                    });
                    streams[i].addEventListener('stream-data', (e) => {
                        switch(e.msg.type) {
                            case 'canvas-clear':
                                canvas.clear();
                                console.log('Cleared the whiteboard.');
                                break;
                            case 'canvas-draw':
                                canvas.loadSnapshot(e.msg.data);
                                console.log('Loaded a whiteboard change.');
                                break;
                            case 'canvas-init':
                                if (!canvas) { mkCanvas(e.msg.data); }
                                console.log(
                                        'Created canvas from existing snapshot.');
                                break;
                            default:
                                console.log(
                                        'Ignoring packet of unknown type.');
                        }
                    });
                }
            };

            room.addEventListener('room-connected', function(roomEvent) {
                // If we are the only one in the room, add a fresh whiteboard.
                if (roomEvent.streams.length == 0) { 
                    mkCanvas(); 
                    console.log('Created new canvas.');
                }

                // Publish the local stream.
                room.publish(localStream, {maxVideoBW: 300}); 
                subscribeToStreams(roomEvent.streams);
            });

            room.addEventListener(
                    'stream-subscribed', 
                    function(_) { addStream(_.stream); });

            room.addEventListener('stream-added', function(streamEvent) {
                if (localStream.getID() != streamEvent.stream.getID()) {
                    subscribeToStreams([streamEvent.stream]);
                }

                // Send the newcomer the current state of the whiteboard.
                localStream.sendData({
                    type: 'canvas-init',
                    data: canvas.getSnapshot()
                });
            });

            room.addEventListener('stream-removed', function(streamEvent) {
                document
                    .getElementById('videoEntry_' + streamEvent.stream.getID())
                    .remove();
            });

            room.addEventListener('stream-failed', function(streamEvent){
                console.log('Stream Failed... uh-oh');
            });

            room.connect();
            addStream(localStream, {speaker: false});
        }

        // Get local media.
        localStream = Erizo.Stream(streamOpts);
        localStream.addEventListener('access-accepted', function(event) {
            join();
        });
        localStream.addEventListener('access-denied', function(event) {
            localStream.close();
            localStream = Erizo.Stream(fallbackStreamOpts);
            localStream.addEventListener('access-accepted', function(event) {
                join();
            });
            localStream.addEventListener('access-denied', function(event) {
                console.log('Stream creation failed.');
            });
            localStream.init();
        });
        localStream.init();
    });
    req.open('POST', nuveUrl + 'createToken/', true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify({username: 'user', role: 'presenter'}));
}

