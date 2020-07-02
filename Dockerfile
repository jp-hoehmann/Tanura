
#
# Docker file for Tanura.
#
# This file configures the container for Tanura.
#

FROM node:8
MAINTAINER Jean-Pierre Höhmann <jp@hhmn.de>
RUN useradd --user-group --shell /bin/nologin app
ENV HOME=/srv/www
RUN mkdir -p ${HOME}/tanura/{bin,public,routes,views,node_modules} /media/docker/licode \
    && chown -R app:app ${HOME}/ /media/docker
COPY --chown=app:app package.json npm-shrinkwrap.json .env app.js init.sh ${HOME}/tanura/
WORKDIR ${HOME}/tanura
USER app
RUN npm install --no-optional
COPY --chown=app:app bin/ ${HOME}/tanura/bin/
COPY --chown=app:app public/ ${HOME}/tanura/public/
COPY --chown=app:app routes/ ${HOME}/tanura/routes/
COPY --chown=app:app views/ ${HOME}/tanura/views/
RUN chmod +x *.sh bin/*
ENTRYPOINT ["./init.sh"]
