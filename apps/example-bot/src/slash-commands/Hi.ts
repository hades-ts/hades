import { command, SlashCommand } from "@hades-ts/slash-commands";


@command("hi", {
    name: "hi",
    description: "Say hi to the bot.",
    type: "CHAT_INPUT",
})
export class HiCommand extends SlashCommand {

    execute() {
        return this.reply(
            "hi"
        );
    }
}