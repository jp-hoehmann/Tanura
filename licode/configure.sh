#!/usr/bin/env bash
. /opt/licode/extras/docker/sysexits.sh

#
# Configure the services for the container.
#

# Do not use this script to configure, if no host name is set.
#
[[ -n ${LICODEHOSTNAME} ]] \
  || exit 0

############
# Settings #
############

# Path to Licode.
#
ROOT=/opt/licode

# Path to scripts directory.
#
SCRIPTS_DIR="${ROOT}/scripts"

# Path to the configuration file.
#
CONFIG="${ROOT}/licode_config.js"

################################################################################
##############              Main routine starts here              ##############
################################################################################

echo "Writing Licode configuration" >&2

[[ -f "$ROOT"/licode_config.js ]] \
  || cp "${SCRIPTS_DIR}/licode_default.js" "${CONFIG}" \
  || exit

# Append STDOUT to the config file.
#
exec >> "${CONFIG}"

# Spawn a maximum of one Erizo process per core, if no explicit limit is set.
[[ -n ${MAXERIZOPROCESSES} ]] \
  || MAXERIZOPROCESSES="$(
    grep -c '^processor' /proc/cpuinfo
  )"

# Set config options.
echo
echo 'config.erizoController.iceServers = [];'
echo "config.erizoController.hostname = '${LICODEHOSTNAME}';"
if [[ -n ${MAXVIDEOBW} ]]
then
    echo "config.erizoController.defaultVideoBW = ${MAXVIDEOBW};"
    echo "config.erizoController.maxVideoBW = ${MAXVIDEOBW};"
fi
echo 'config.erizoController.ssl = true;'
[[ -z ${SSL} ]] \
    && echo 'config.erizoController.listen_ssl = false;' \
    || echo 'config.erizoController.listen_ssl = true;'
echo "config.erizoAgent.maxProcesses = ${MAXERIZOPROCESSES};"
if [[ -n ${ERIZOPORT} ]]
then
    echo "config.nuve.testErizoController = 'localhost:${ERIZOPORT}';"
    echo "config.erizoController.port = ${ERIZOPORT};"
    echo "config.erizoController.listen_port = ${ERIZOPORT};"
fi
