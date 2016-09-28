#!/bin/bash -e

#
# Initialization routine for Tanura.
#
# This is the OS part of Tanura's bootstrapping process. Any steps necessary for 
# node to start are taken here.
#
# TODO This should have more error handling.
#

# Wait until the files provided by Licode become visible, in case they are not 
# available form the start.
sleep 2
while ! [[ -f /media/docker/licode/licode_config.js ]]
do
    echo 'Waiting for Licode to export its configuration.'
    sleep 1
done

# Copy the libraries and configuration necessary to interact with Licode into 
# place.
cp /media/docker/licode/erizo.js public/javascripts
cp /media/docker/licode/{nuve,licode_config}.js .

# Launch node.
bin/wait-for-it.sh -s -h licode -p 3000 -t 0 -- npm start

