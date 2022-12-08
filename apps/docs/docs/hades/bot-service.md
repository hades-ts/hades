# HadesBotService

`HadesBotService` is a base class for your bot service. It provides a couple core conveniences most bots will need.

## Logging In

`HadesBotService` exposes a `login()` method which will log the bot in to Discord.

```ts
// src/index.ts
const bot = container.get(MyBotService);
bot.login();
```

## Handling Events

`HadesBotService` exposes a number of methods which are called when the associated Discord.js event is fired.

Once your bot is logged in, the `onReady()` method will be called.

```ts
// src/services/BotService.ts
@singleton()
export class BotService extends HadesBotService {
    async onReady() {
        console.log(`Logged in as ${this.client.user.username}.`);
    }
}
```

## Designing Your Bot

Using the `@inject()` decorator, you can inject any other service into your bot service.

By depending on other services, your bot service can stay small and easy to understand.

```ts
// src/services/BotService.ts
@singleton()
export class BotService extends HadesBotService {
    @inject(ILogger)
    log: ILogger;

    @inject(ICommandService)
    commands: ICommandService;

    async onMessage(message: Message) {
        if (message.author.bot) return;
        await this.commands.handle(message);
    }

}
```

This convention of delegating work to other services applies to those services as well. 

This approach can help you to keep the components of your bot small and easy to understand.