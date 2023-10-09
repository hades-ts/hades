# Installation

Install the latest version of `@hades-ts/hades` from Git using NPM or your package manager of choice:

    npm i --save @hades-ts/hades

## Dependencies

Hades requires the following peer dependencies to be installed:

    npm i --save inversify inversify-binding-decorators reflect-metadata discord.js

## Configuration

Hades reads configuration from `config/default.json`.

Create this file with your details:

```json
{
  "discordToken": "your bot token",
  "botOwner": "your discord id"
}
```
