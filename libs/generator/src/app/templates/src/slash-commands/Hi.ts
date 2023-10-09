import { command, SlashCommand } from "@hades-ts/slash-commands";

@command("hi", { description: "Say 'hi'." })
export class ExplainCommand extends SlashCommand {
    async execute(): Promise<void> {
        this.interaction.reply("Hi. :)");
    }
}
