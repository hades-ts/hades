# Getting Started

This is a minimal but working bot:

```ts
import { boot, HadesBotService, singleton } from "hades";

export class BotService extends HadesBotService {
  async onReady() {
    console.log(`Logged in as ${this.client.user.username}.`);
  }
}

boot(BotService)
```

The `boot` function will connect the bot service to Discord.

`BotService.onReady()` will be called when the associated Discord.js event is
fired.

## Bot Configuration

Add your token and user ID to `config/default.json`:

```json
{
  "discordToken": "your bot token here",
  "botOwner": "your discord id here"
}
```

## Starting the bot

You can use [tsx](https://www.npmjs.com/package/tsx) to run your script:

```
npx tsx src/index.ts
```

## Listening to Events

The `onReady` method is not the only event handler you can provide:

```ts
import { boot, HadesBotService, singleton } from "hades";

export class BotService extends HadesBotService {
  async onReady() {
    console.log(`Logged in as ${this.client.user.username}.`);
  }

  async onMessage(message: Message) {
      if (this.isHighlight(message.content)) {
        await message.reply('Hello!');
      }
  }
}

boot(BotService)
```

Now the bot will respond when you highlight it.

There are many events that you can handle. The next section shows a listing.
