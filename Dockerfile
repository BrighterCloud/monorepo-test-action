FROM node:10

LABEL "com.github.actions.name"="Monorepo PR Test executor"
LABEL "com.github.actions.description"="Runs tests in changed sub repositories of a monorepo"

LABEL "repository"="https://github.com/BrighterCloud/monorepo-test-action"

ADD entrypoint.sh /action/entrypoint.sh
ADD package.json /action/package.json
ADD app.js /action/app.js
ADD helpers.js /action/helpers.js

RUN chmod +x /action/entrypoint.sh

RUN apt-get update
RUN apt-get install -y software-properties-common
RUN apt-add-repository 'deb http://deb.debian.org/debian jessie main'
RUN apt-get update
RUN apt-get install -y libcurl3 libssl1.0.0

ENTRYPOINT ["/action/entrypoint.sh"]
