
#
# Docker file for Tanura.
#
# This file configures the container for Tanura.
#

FROM node:8
MAINTAINER Jean-Pierre Höhmann <jp@hhmn.de>
RUN useradd --user-group --shell /bin/nologin app
ENV HOME=/srv/www
RUN mkdir -p ${HOME}/tanura/node_modules /media/docker/licode
COPY package.json npm-shrinkwrap.json ${HOME}/tanura/
RUN chown -R app:app ${HOME}/ /media/docker
USER app
WORKDIR ${HOME}/tanura
RUN npm install --no-optional
USER root
COPY . ${HOME}/tanura
RUN chown -R app:app ${HOME}/*
RUN chmod +x *.sh bin/*
USER app
ENTRYPOINT ["./init.sh"]

