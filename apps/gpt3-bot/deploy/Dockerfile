# A multi-part Dockerfile for building the GPT3 typescript Bot app.
# The Dockerfile is located at apps/gpt3-bot/deploy/Dockerfile in a RushJS monorepo.

# Stage 1: Build the app
FROM node:18-alpine AS build

RUN apk add --no-cache git

RUN npm install -g @microsoft/rush pnpm

# Install dependencies
WORKDIR /monorepo

COPY ../../ ./

RUN rush update

RUN rush build --to gpt3-bot

WORKDIR /monorepo/apps/gpt3-bot

VOLUME /monorepo/apps/gpt3-bot/data

VOLUME /monorepo/apps/gpt3-bot/config

ENTRYPOINT [ "node", "dist/index.js" ]