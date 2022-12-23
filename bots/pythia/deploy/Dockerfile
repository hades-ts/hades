FROM node:18-alpine

RUN apk add --no-cache git

RUN npm install -g @microsoft/rush pnpm

WORKDIR /monorepo

COPY ../../../../ ./

RUN rush update

RUN rush build --to pythia

WORKDIR /monorepo/bots/pythia

VOLUME /monorepo/bots/pythia/data

VOLUME /monorepo/bots/pythia/config

ENTRYPOINT [ "node", "dist/index.js" ]
