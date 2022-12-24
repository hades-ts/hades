import { arg, command, description, TextArgError, TextCommand, validate } from "@hades-ts/text-commands";


@command("squared")
@description("Get the square of a number.")
export class Squared extends TextCommand {

    @arg()
    @description("Number to square.")
    input!: number

    async execute() {
        const square = this.input * this.input;
        return this.reply(
            `${this.input} squared is ${square}.`
        );
    }

    @validate("input")
    async mustBePositive() {
        if (this.input < 0) {
            throw new TextArgError("Value must be positive.")
        }
    }
}