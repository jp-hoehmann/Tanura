
#
# Docker file for Licode.
#
# This file configures the container for Licode.
#

FROM lynckia/licode:latest
MAINTAINER Jean-Pierre Höhmann <jp@hhmn.de>
RUN apt update && apt -y upgrade
COPY init.sh configure.sh export.sh sysexits.sh /opt/licode/extras/docker/
WORKDIR /opt/licode/extras/docker
ENTRYPOINT ["./init.sh"]
