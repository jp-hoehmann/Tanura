
#
# Docker file for Licode.
#
# This file configures the container for Licode.
#

FROM lynckia/licode:latest
MAINTAINER Jean-Pierre Höhmann <jp@hhmn.de>
RUN apt update && apt -y upgrade
WORKDIR /opt/licode/extras/docker
COPY init.sh configure.sh export.sh sysexits.sh ./
RUN chmod +x *.sh
ENTRYPOINT ["./init.sh"]
