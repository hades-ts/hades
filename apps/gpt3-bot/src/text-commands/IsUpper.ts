import { arg, command, description, TextArgError, TextArgInstaller, TextCommand, TextCommandContext, Validator } from "@hades-ts/text-commands";


export class UppercaseValidator extends Validator {

    public async validate(arg: TextArgInstaller, ctx: TextCommandContext, value: string) {
        if (value !== value.toUpperCase()) {
            throw new TextArgError(`${value} is not uppercase.`);
        }
    }

}

@command("isUpper")
@description("Check if string is uppercase.")
export class IsUpper extends TextCommand {

    @arg()
    @description("String to check.")
    @UppercaseValidator.check()
    input!: Uppercase<string>;

    async execute() {
        return this.reply(
            `${this.input} is indeed uppercase.`
        );
    }
}