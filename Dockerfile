FROM node:8-slim

LABEL "com.github.actions.name"="Monorepo PR Test executor"
LABEL "com.github.actions.description"="Runs tests in changed sub repositories of a monorepo"
LABEL "com.github.actions.icon"="git-merge"
LABEL "com.github.actions.color"="green"

LABEL "repository"="https://github.com/BrighterCloud/monorepo-test-action"

ADD entrypoint.sh /action/entrypoint.sh
ADD package.json /action/package.json
ADD app.js /action/app.js
ADD helpers.js /action/helpers.js

RUN chmod +x /action/entrypoint.sh

ENTRYPOINT ["/action/entrypoint.sh"]