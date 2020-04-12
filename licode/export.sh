#!/usr/bin/env bash
. /opt/licode/extras/docker/sysexits.sh

#
# Export files for use by Tanura.
#

############
# Settings #
############

# Path to Licode.
#
ROOT=/opt/licode

################################################################################
##############              Main routine starts here              ##############
################################################################################

cd "${ROOT}" \
  || exit

echo "Exporting Licode API."
echo "Exporting Erizo API."
echo "Exporting Licode configuration."
cp \
        erizo_controller/erizoClient/dist/erizo.js \
        nuve/nuveClient/dist/nuve.js \
        licode_config.js \
        /srv/docker/licode
