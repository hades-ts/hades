FROM node:18-alpine

RUN apk add --no-cache git

RUN npm install -g @microsoft/rush pnpm

WORKDIR /monorepo

COPY ../../../../ ./

RUN rush update

RUN rush build --to zeus

WORKDIR /monorepo/bots/zeus

VOLUME /monorepo/bots/zeus/data

VOLUME /monorepo/bots/zeus/config

ENTRYPOINT [ "node", "dist/index.js" ]
