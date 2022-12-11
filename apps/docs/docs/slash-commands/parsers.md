# Argument Parsers

By default, arguments are provided as strings.

Argument values can be automatically parsed into other types using the `@parser()` decorator:

```ts
@command('squared')
export class Squared extends SlashCommand {

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
- `MemberParser`: a User of the current Guild
- `RoleParser`: a Role of the current Guild
- `String`: any string, the default parser
- `User`: a Discord user

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
- `User` => `UserParser`
- `Role` => `RoleParser`
- `GuildChannel` => `GuildChannelParser`
- `GuildMember` => `MemberParser`

You can provide your own mapping by providing it to `SlashCommandsInstaller`:

```ts
const container = new HadesContainer({
    installers: [
        new SlashCommandsInstaller(
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
export class YoutubeVideo extends SlashArgParser {
    name = 'youtube video'
    description = 'A YouTube Video'

    async parse(
        arg: SlashArgInstaller, 
        interaction: BaseCommandInteraction
    ) {
        const value = interaction.options.getString(arg.name)
        const match = value.match(/^([\w-]{11})(?:\S+)?$/)
        if (!match) {
            throw new SlashArgError('Invalid YouTube video ID.')
        }
        return new YoutubeVideo(match[1])
    }
}
```

If the argument cannot be parsed, a `SlashArgError`  can be thrown.