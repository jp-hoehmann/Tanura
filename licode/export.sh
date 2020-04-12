#!/usr/bin/env bash
. /opt/licode/extras/docker/sysexits.sh

#
# Export files for use by Tanura.
#
# This script is fire-and-forget, so no proper error handling.
#

############
# Settings #
############

# Path to Licode.
#
ROOT=/opt/licode

# Path to shared docker volume
#
SRV=/srv/docker/licode

# Path to erizo.js
#
ERIZO=erizo_controller/erizoClient/dist/production/erizo/erizo.js

# Path to nuve.js
#
NUVE=nuve/nuveClient/dist/nuve.js

# Path to licode_config.js
#
LICODE_CONFIG=licode_config.js

################################################################################
##############              Main routine starts here              ##############
################################################################################

cd "${ROOT}" \
  || exit

until [[ -f ${ERIZO} && -f ${NUVE} && -f ${LICODE_CONFIG} ]]
do echo "Waiting for licode to export its configuration..." && sleep 2
done

echo "Exporting Licode configuration."
echo "Exporting Nuve API."
echo "Exporting Erizo API."
cp "${ERIZO}" "${NUVE}" "${LICODE_CONFIG}" "${SRV}"
