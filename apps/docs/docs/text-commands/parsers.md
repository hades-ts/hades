# Argument Parsers

By default, arguments are provided as strings.

Argument values can be automatically parsed into other types using the `@parser()` decorator:

```ts
@command('squared')
export class Squared extends TextCommand {

    @arg()
    @parser(IntegerParser)
    input!: number

    async execute() {
        const square = this.input * this.input;
        return this.reply(
            `${this.input} squared is ${square}.`
        );
    }
}
```

If the argument cannot be parsed, a message will be sent to the user reporting the problem.

## Built-in Parsers

There are a number of built-in parsers available:

- `ChannelParser`: a Discord channel
- `ChannelIdParser`: a Discord channel ID
- `FloatParser`: a floating-point number
- `GuildChannelParser`: a Discord channel of the current Guild
- `IntegerParser`: a integer number
- `MemberParser`: a User of the current Guild
- `RoleParser`: a Role of the current Guild
- `RoleIdParser`: the ID of a Role of the current Guild
- `String`: any string, the default parser
- `User`: a Discord user
- `UserId` a Discord user ID

## Default Parsers

By default, a number of field types have automatically associated parsers.

In the above example, Hades will observe the field's type is `number` and automatically use the `IntegerParser`. So the `@parser(IntegerParser)` bit can be removed:

```ts
@command("squared")
export class Squared extends TextCommand {

    @arg()
    input!: number // automatically parsed with IntegerParser

    async execute() {
        const square = this.input * this.input;
        return this.reply(
            `${this.input} squared is ${square}.`
        );
    }
}
```

Here are the default type-parser associations:

- `string` => `StringParser`
- `number` => `IntegerParser`
- `Channel` => `ChannelParser`
- `User` => `UserParser`
- `Role` => `RoleParser`
- `GuildChannel` => `GuildChannelParser`
- `GuildMember` => `MemberParser`

You can provide your own mapping by providing it to `TextCommandsInstaller`:

```ts
const container = new HadesContainer({
    installers: [
        new TextCommandsInstaller(
            [
                ...defaultMappedTypes,
                [Number, FloatParser],
            ]
        ),
    ],
});
```

Now the `Squared` command above would only accept floating-point numbers.


## Custom Parsers

You can also implement your own parsers by extending the `Parser` class:

```ts
@parser()
export class YoutubeVideo extends TextArgParser {
    name = 'youtube video'
    description = 'A YouTube Video'

    async parse(arg: TextArgInstaller, context: TextCommandContext) {
        const value = context.reader.getString()
        const match = value.match(/^([\w-]{11})(?:\S+)?$/)
        if (!match) {
            throw new TextArgError('Invalid YouTube video ID.')
        }
        return new YoutubeVideo(match[1])
    }
}
```

If the argument cannot be parsed, a `TextArgError`  can be thrown.

## Manually Parsing Arguments

Instead of using decorated fields, you can also manually parse arguments passed to your commands using the `CommandContext.reader` attribute.

`CommandContext.reader` is a parser from [discord-command-parser](https://github.com/campbellbrendene/discord-command-parser).

This can parse arguments in a more structured way, including user and channel IDs.

- **getString()**
- **getInt()**
- **getFloat()**
- **getRemaining()**
- **getUserID()**
- **getRoleID()**
- **getChannelID()**
- **seek(** amount: number = 1 **)**: Useful for skipping tokens