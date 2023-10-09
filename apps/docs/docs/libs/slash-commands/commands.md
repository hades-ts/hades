# Commands

Writing commands is easy. Just subclass `SlashCommand` and slap the `@command` decorator on top:

```ts
@command("hi", { description: "Say hi to me!" })
export class HiCommand extends SlashCommand {
  async execute() {
    await this.reply("Hello!");
  }
}
```

When the command is executed, the `execute` method is called. You can use the `reply` method to send a message to the channel the command was executed in.

## @command Decorator

The `@command` marks a class as a command.

It takes two arguments:

- `name`: The name of the command. This is what users will type to execute the command.
- `options`: An object with additional options. See below for more information.

### Options

- `description`: The description of the command. This is shown in the command picker.
