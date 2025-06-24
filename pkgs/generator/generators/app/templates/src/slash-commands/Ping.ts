import { command, SlashCommand } from "@hades-ts/slash-commands";

@command("ping", { description: "Ping the bot." })
export class PingCommand extends SlashCommand {
    async execute(): Promise<void> {
        await this.interaction.reply({
            content: "Pong!",
        });
    }
}
