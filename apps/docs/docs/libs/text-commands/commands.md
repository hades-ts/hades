# Commands

Writing commands is easy. Just subclass `TextCommand` and slap the `@command` decorator on top:

```ts
@command('hi')
export class HiCommand extends TextCommand {
    async execute() {
        await this.reply('Hello!')
    }
}
```

When the command is executed, the `execute` method is called. You can use the `reply` method to send a message to the channel the command was executed in.

## @command Decorator

The `@command` marks a class as a command.

It takes a single argument, which is the name of the command. This is what users will type to execute the command.