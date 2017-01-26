'use strict';

/*
 * Client entrypoint.
 *
 * This script contains all code necessary to bootstrap Tanura in a client.
 */

/**
 * Information about Nuve.
 */
tanura.nuve = {
    url: tanura.url + 'nuve/',
    room: null
};

/**
 * Information about Erizo.
 */
tanura.erizo = {
    localStream: null
};

/**
 * Information about the whiteboard.
 */
tanura.whiteboard = {
    url: tanura.url + 'whiteboard/',
    canvas: null
};

/**
 * Tanura init routine.
 */
tanura.run = function() {
    var _ = tanura.options;

    /**
     * Fake resize indicator.  Because of CSS bugs and limitations, Tanura will 
     * sometimes have to change layout parameters manually in Js. As this 
     * happens after the resize, a second resize event may be triggered to give 
     * other Js code the ability to react to changes Tanura has made to the 
     * layout. In this case, this variable will be set to true, to tell Tanura, 
     * that the resize event was a fake resize event triggered by Tanura's own 
     * code and should be ignored.
     */
    var fakeResize = false;

    /**
     * Options that should be used to stream.
     */
    var streamOpts = {
        audio: !! _.audio,
        video: !! _.video,
        data: true,
        screen: false,
    };

    /**
     * The stream options Tanura will fall back to.  These options will be used 
     * when establishing a stream with the default options fails. This is 
     * usually due to the user not granting the necessary permissions, the 
     * browser not supporting all necessary features, or is blocking some of 
     * them due to security concerns.
     */
    var fallbackStreamOpts = {
        audio: false,
        video: false,
        data: true,
        screen: false,
    };

    /**
     * This will initialize the whiteboard on the canvas from a given snapshot.
     */
    var mkCanvas = (snapshot) => {
        tanura.whiteboard.canvas = LC.init(
                document.getElementById('whiteboard'), 
                {snapshot: snapshot});
        tanura.whiteboard.canvas.setTool(
            new LC.tools.Pencil(tanura.whiteboard.canvas));
        tanura.whiteboard.canvas.on(
            'drawEnd', () => tanura.erizo.localStream.sendData({
                type: 'canvas-draw',
                data: tanura.whiteboard.canvas.getSnapshot()
            }));
    }

    var body = document.getElementsByTagName('body')[0];

    // Manually calculate the size of some elements to work around flexbox 
    // issues and limitations.
    var f = () => {
        if (!fakeResize) {

            // Wait for transitions.
            setTimeout(() => {
                /*
                 * There is currently no code here, but this will be needed 
                 * again in the future.
                 */

                // Pass another resize for Literallycanvas.
                fakeResize = true;
                dispatchEvent(new Event('resize'));
            }, 200);
        } else {
            fakeResize = false;
        }
    }
    window.addEventListener('throttledResize', f);
    f();

    // Connect to Tanura.
    var connect = () => {
        // Wait for Erizo to load.
        if (typeof Erizo === 'undefined' || Erizo == null) {
            setTimeout(connect, 100);
            return;
        }

        // Prepare a request for a room token.
        var req = new XMLHttpRequest();
        req.addEventListener('load', function() {
            var token = this.responseText;
            console.log(token);
            tanura.nuve.room = Erizo.Room({token: token});
            var join = function() {
                // Add a single stream to the DOM.
                var addStream = function(stream, options) {
                    if (stream.hasVideo()) {
                        var videoEntry = document.createElement('div');
                        videoEntry
                            .setAttribute('id', 'videoEntry_' + stream.getID());
                        document
                            .getElementById('people')
                            .appendChild(videoEntry);
                        stream.show('videoEntry_' + stream.getID(), options);
                    }
                };

                // Subscribe to a list of streams.
                var subscribeToStreams = function(streams) {
                    for (var i in streams) {
                        tanura.nuve.room.subscribe(streams[i]);
                        streams[i]
                            .addEventListener(
                                    'bandwidth-alert',
                                    function(e) {
                                        console.log(
                                                'Bandwidth Alert',
                                                e.msg,
                                                e.bandwidth);
                                    });
                        streams[i].addEventListener('stream-data', (e) => {
                            switch(e.msg.type) {
                                case 'canvas-clear':
                                    tanura.whiteboard.canvas.clear();
                                    console.log('Cleared the whiteboard.');
                                    break;
                                case 'canvas-draw':
                                    tanura
                                        .whiteboard
                                        .canvas
                                        .loadSnapshot(e.msg.data);
                                    console.log('Loaded a whiteboard change.');
                                    break;
                                case 'canvas-init':
                                    if (!tanura.whiteboard.canvas) { 
                                        mkCanvas(e.msg.data); 
                                    }
                                    console.log(
                                            'Created canvas from existing '
                                            + 'snapshot.');
                                    break;
                                default:
                                    console.log(
                                            'Ignoring packet of unknown type.');
                            }
                        });
                    }
                };

                // This will run as soon a signalling if fully initialized.
                tanura.nuve.room.addEventListener(
                    'room-connected', function(roomEvent) {
                        // If we are the only one in the room, add a fresh 
                        // whiteboard.
                        if (roomEvent.streams.length == 0) {
                            mkCanvas(); 
                            console.log('Created new canvas.');
                        }

                        // Publish the local stream.
                        tanura.nuve.room.publish(
                            tanura.erizo.localStream, {maxVideoBW: 300});
                        subscribeToStreams(roomEvent.streams);

                        // Init done, run callback.
                        for (var i of tanura.events.init) { i(); }
                    });

                // This will run whenever the client was successfully subscribed 
                // to a new stream.
                tanura.nuve.room.addEventListener(
                        'stream-subscribed', 
                        function(_) { addStream(_.stream); });

                // This will run whenever a new stream was added to the room.
                tanura.nuve.room.addEventListener(
                    'stream-added', function(streamEvent) {
                        // Attach to the new stream.
                        subscribeToStreams([streamEvent.stream]);

                        // If the new stream isn't our own stream.
                        if (
                            tanura.erizo.localStream.getID()
                            != streamEvent.stream.getID()
                        ) {
                            // Send the newcomer the current state of the 
                            // whiteboard.  This is wasteful as the new client 
                            // will get the state by each other client, but 
                            // I don't know a better way to do it.  The way 
                            // forward will likely be to have the server control 
                            // the whiteboard.
                            tanura.erizo.localStream.sendData({
                                type: 'canvas-init',
                                data: tanura.whiteboard.canvas.getSnapshot()
                            });
                        }
                    });

                // This will run whenever a stream disappeared from the room.
                tanura.nuve.room.addEventListener(
                    'stream-removed', function(streamEvent) {
                        document
                            .getElementById(
                                    'videoEntry_' + streamEvent.stream.getID())
                            .remove();
                    });

                // This will run if opening the stream has failed.
                tanura.nuve.room.addEventListener(
                    'stream-failed', function(streamEvent) {
                        // FIXME This needs error handling.
                        console.log('Stream Failed... uh-oh');
                    });

                // All set. Connect to the room.
                tanura.nuve.room.connect();

                // Don't attach to the local stream. For development purposes it 
                // is nicer if the users own stream is attached remotely too.
                //addStream(tanura.erizo.localStream, {speaker: false});
            }

            // Get local media.
            tanura.erizo.localStream = Erizo.Stream(streamOpts);
            tanura
                .erizo
                .localStream
                .addEventListener('access-accepted', function(event) {
                    join();
                });
            tanura
                .erizo
                .localStream
                .addEventListener('access-denied', function(event) {
                    tanura.erizo.localStream.close();
                    tanura.erizo.localStream = Erizo.Stream(fallbackStreamOpts);
                    tanura
                        .erizo
                        .localStream
                        .addEventListener('access-accepted', function(event) {
                            join();
                        });
                    tanura
                        .erizo
                        .localStream
                        .addEventListener('access-denied', function(event) {
                            console.log('Stream creation failed.');
                        });
                    tanura.erizo.localStream.init();
                });
            tanura.erizo.localStream.init();
        });
        req.open('POST', tanura.nuve.url + 'createToken/', true);
        req.setRequestHeader('Content-Type', 'application/json');

        // Send the room-token request.
        req.send(JSON.stringify({username: 'user', role: 'presenter'}));
    }

    connect();
}

// Run, if initialisation is done already.
if (tanura.options) { tanura.run(); }
