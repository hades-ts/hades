FROM node:18-alpine

RUN apk add --no-cache git

RUN npm install -g @microsoft/rush pnpm

WORKDIR /monorepo

COPY ../../../../ ./

RUN rush update

RUN rush build --to chaos

WORKDIR /monorepo/bots/chaos

VOLUME /monorepo/bots/chaos/data

VOLUME /monorepo/bots/chaos/config

ENTRYPOINT [ "node", "dist/index.js" ]
