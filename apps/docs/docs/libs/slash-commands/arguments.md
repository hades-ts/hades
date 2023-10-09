# Arguments

Commands can accept arguments. Just define a class field and slap the `@arg` decorator on top:

```ts
@command("reverse")
export class ReverseCommand extends SlashCommand {
  @arg()
  text: string;

  async execute() {
    const reversed = this.text.split("").reverse().join("");
    await this.reply(reversed);
  }
}
```

For example, if a user types `"/reverse hello"`, the `text` field will be set to `"hello"`.
