#!/usr/bin/env bash
. /opt/licode/extras/docker/sysexits.sh

#
# Configure and run the services for the container.
#

############
# Settings #
############

# Name of the script.
#
SCRIPT="$(pwd)/${0}"

# Path to the script.
#
PATHNAME="$(dirname "${SCRIPT}")"

#############
# Functions #
#############

# Print a given error message and abort with a given error code.
#
fail() {
  echo "${2}" 2>&1
  exit "${1}"
}

################################################################################
##############              Main routine starts here              ##############
################################################################################

# The failure condition can never normally occur. Safeguard exists
# purely to avoid accidentally running the script on a development
# machine.
cd "${PATHNAME}" \
  || fail "${EX_NOINPUT}" "Cannot access configuration scripts."

# Write licode_config.js.
./configure.sh 2>&1 \
  || fail "${EX_CANTCREAT}" "Failed to write licode configuration."

# Expose erizo.js, nuve.js and licode_config.js for tanura.
./export.sh 2>&1 &

# The failure condition can never normally occur. Safeguard exists
# purely to avoid accidentally running the script on a development
# machine.
cd /opt \
  || fail "${EX_SOFTWARE}" "Cannot open /opt."

# Find the public IP automatically using DNS, if none is set.
[[ -n ${HOSTIP} ]] \
  || HOSTIP="$(
    getent hosts "${LICODEHOSTNAME}" \
      | perl -pe 's/\s.*//;'
  )"
PUBLIC_IP="${HOSTIP}"
export PUBLIC_IP

# Reexport variables set with legacy names.
[[ -n ${PUBLIC_IP} ]] \
  || PUBLIC_IP="${HOSTIP}"
# shellcheck disable=SC2153
[[ -n ${MIN_PORT} ]] \
  || MIN_PORT="${MINPORT}"
# shellcheck disable=SC2153
[[ -n ${MAX_PORT} ]] \
  || MAX_PORT="${MAXPORT}"
export \
  PUBLIC_IP \
  MIN_PORT \
  MAX_PORT

exec ./licode/extras/docker/initDockerLicode.sh
