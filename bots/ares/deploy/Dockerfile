FROM node:18-alpine

RUN apk add --no-cache git

RUN npm install -g @microsoft/rush pnpm

WORKDIR /monorepo

COPY ../../../../ ./

RUN rush update

RUN rush build --to ares

WORKDIR /monorepo/bots/ares

VOLUME /monorepo/bots/ares/data

VOLUME /monorepo/bots/ares/config

ENTRYPOINT [ "node", "dist/index.js" ]
