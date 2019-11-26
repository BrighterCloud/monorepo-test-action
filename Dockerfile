FROM node:10-slim

LABEL "com.github.actions.name"="Monorepo PR Test executor"
LABEL "com.github.actions.description"="Runs tests in changed sub repositories of a monorepo"

LABEL "repository"="https://github.com/BrighterCloud/monorepo-test-action"

ADD entrypoint.sh /action/entrypoint.sh
ADD package.json /action/package.json
ADD app.js /action/app.js
ADD helpers.js /action/helpers.js

RUN chmod +x /action/entrypoint.sh

ENTRYPOINT ["/action/entrypoint.sh"]
