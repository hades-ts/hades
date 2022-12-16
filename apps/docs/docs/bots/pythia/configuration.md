# Configuration

Copy `config/default.template.json` to `config/default.json`

```json
{
  "discordToken": "your bot token here",
  "botOwner": "your discord id here",
  "gpt3Token": "you openAI token here",
  "transcriptsPath": "data/transcripts",
  "quota": {
    "quotaFile": "data/quota.json",
    "globalDailyTokenLimit": 10000,
    "userDailyTokenLimit": 1000
  },
  "guilds": {
    "<guild id>": {
      "prompt": "your GPT prompt here",
      "roleExemptions": {
        "users": ["<user id>"],
        "roles": ["<role id>"]
      }
    }
  }
}
```

## `discordToken`

The Discord Bot token for your bot.

## `botOwner`

The Discord User ID of the bot admin.

## `gpt3Token`

An OpenAI API token.

## `transcriptsPath`

Where to store on-going threads.

## `quota`

Configuration for the token quota:

- `quotaFile` - Where to store the quota file.
- `globalDailyTokenLimit` - The global daily token limit.
- `userDailyTokenLimit` - The user daily token limit.

## `guilds`

Per-guild configuration:

- `prompt` - The GPT prompt to use for this guild.
- `roleExemptions` - A list of users and roles that are exempt from the token quota.

### `roleExemptions`

- `users` - A list of user IDs that are exempt from the token quota.
- `roles` - A list of role IDs that are exempt from the token quota.
