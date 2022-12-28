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

1. Create a `rules` folder under the guild id folder that is under the `data` folder.
2. Create a file (json, md, or yaml extension) that contains the rule information.

### Example

```
---
description: Rule description
title: Rule title
---
Rule content (i.e. No swearing...)
```

## Roles

1. Create a `roles` folder under the guild id folder that is under the `data` folder.
2. Create a file (json, md, or yaml extension) that contains the role information.

### Creating Roles

In the discord server, you can create a role by going to the "Server Settings" -> "Roles" section. After creating or editing a role, you can copy the role id from the kebab options for the role.

### Example

```
---
description: Helper role
title: Helper
roleId: "<role id>"
---
```