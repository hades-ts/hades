


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

## Running the Bot

```sh
$ npm run start
```
