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