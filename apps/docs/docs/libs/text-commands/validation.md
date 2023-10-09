# Argument Validation

Arguments values can be validated by placing the `@validate()` decorator on a method:

```ts
@command("factorial")
export class Factorial extends TextCommand {
  @arg()
  input!: number;

  @validate("input")
  mustBePositive() {
    if (this.input < 0) {
      throw new TextArgError("Input must be positive.");
    }
  }

  async execute() {
    const factorial = factorial(this.input);
    return this.reply(`${this.input}! = ${factorial}.`);
  }
}
```

In this case, the `mustBePositive` method will be called before the command is executed. If it throws an error, the error will be reported to the user.

## Reusable Validators

You can also implement `Validator` subclasses for reusable validation:

```ts
export class NotMeValidator extends Validator {
  @inject(HadesClient)
  client: HadesClient;

  async validate(
    arg: TextArgInstaller,
    context: TextCommandContext,
    value: User,
  ) {
    if (value.id === this.client.user.id) {
      throw new TextArgError("You can't use this command on me.");
    }
  }
}
```

The `NotMeValidator` checks that an argument parsed as a `User` is not the bot itself. It can be used like this:

```ts
@command("not-me")
export class NotMeCommand extends TextCommand {
  @arg()
  @parser(UserParser)
  @NotMeValidator.check()
  user!: User;

  async execute() {
    await this.reply(`You used the command on ${this.user.tag}.`);
  }
}
```
