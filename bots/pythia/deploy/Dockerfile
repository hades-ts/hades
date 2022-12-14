FROM node:18-alpine

RUN apk add --no-cache git

RUN npm install -g @microsoft/rush pnpm

WORKDIR /monorepo

COPY ../../ ./

RUN rush update

RUN rush build --to gpt3-bot

WORKDIR /monorepo/apps/gpt3-bot

VOLUME /monorepo/apps/gpt3-bot/data

VOLUME /monorepo/apps/gpt3-bot/config

ENTRYPOINT [ "node", "dist/index.js" ]