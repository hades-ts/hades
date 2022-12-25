# Configuration

Copy `config/default.template.json` to `config/default.json`

```json
{
  "discordToken": "your bot token here",
  "botOwner": "your discord id here",
  "guilds": {
    "<guild id>": {
      "stashChannels": {
        "<channel id>": "path to stash file"
      }
    }
  }
}
```

## `discordToken`

The Discord Bot token for your bot.

## `botOwner`

The Discord User ID of the bot admin.

## `guilds`

### `stashChannels`

## Rules

Create a `rules` folder under the guild id folder that is under the `data` folder.
Then, create a file with a json, md, or yaml extension that contains the rule information.

### Example

```
---
description: Rule description
title: Rule title
---
Rule content (i.e. No swearing...)
```