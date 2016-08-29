#!/bin/bash -e

#
# Initialization routine for Tanura.
#

sleep 2
while ! [[ -f /media/docker/licode/licode_config.js ]]
do
    echo 'Waiting for Licode to export its configuration.'
    sleep 1
done

cp /media/docker/licode/erizo.js public/javascripts
cp /media/docker/licode/{nuve,licode_config}.js .

bin/wait-for-it.sh -s -h licode -p 3000 -t 0 -- npm start

