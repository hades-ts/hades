FROM node:18-alpine

RUN apk add --no-cache git

RUN npm install -g @microsoft/rush pnpm

WORKDIR /monorepo

COPY ../../../../ ./

RUN rush update

RUN rush build --to apollo

WORKDIR /monorepo/bots/apollo

VOLUME /monorepo/bots/apollo/data

VOLUME /monorepo/bots/apollo/config

ENTRYPOINT [ "node", "dist/index.js" ]
