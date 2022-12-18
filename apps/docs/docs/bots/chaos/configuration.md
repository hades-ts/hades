# Configuration

Copy `config/default.template.json` to `config/default.json`

```json
{
  "discordToken": "your bot token here",
  "botOwner": "your discord id here",
  "gpt3Token": "you openAI token here",
  "dataDirectory": "where to store data",
  "guilds": {
    "<guild id>": {
      "hour": "when to rollover",
      "channel": "the channel to manage",
    }
  }
}
```

## `discordToken`

The Discord Bot token for your bot.

## `botOwner`

The Discord User ID of the bot admin.

## `dataDirectory`

This is where Chaos will store its data.

## `guilds`

Configuration for each guild

- `hour` - Which hour of the day to roll over to a new message.
- `channel` - Which channel to manage and post the messages in.