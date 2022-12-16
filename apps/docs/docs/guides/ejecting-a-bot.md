# Ejecting Bots

The Hades repository contains a number of example bots. These bots can be ejected from the repository and used as a starting point for your own bot. This guide will walk you through the process of ejecting a bot.

## Prerequisites

You'll need the [Rush](https://rushjs.io/) tool to work with the Hades repository. You can install it with the following command:

```sh
npm install -g @microsoft/rush
```

## Cloning the Repository

Clone the Hades repository:

```sh
git clone git@github.com:hades-ts/hades.git
cd hades
rush update
```

## Ejecting a Bot

To eject a bot, run the following command:

```sh
rush eject
```

You'll be prompted for the following information:

- Which bot to eject
- Where to eject it to

## Configuring the Bot

Copy `config/default.template.json` to `config/default.json` and fill in the values for your bot.

- `discordToken` - The token for your Discord bot
- `botOwner` - The Discord ID of the bot owner

Each bot may have additional configuration options. Refer to the README for the bot you're ejecting for more information.

## Running the Bot

Once ejected, just run the following command from the root of the project:

```sh
npm i
npm run start
```