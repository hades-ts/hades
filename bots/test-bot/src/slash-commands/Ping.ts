import { HadesClient } from "@hades-ts/hades";
import { command, SlashCommand } from "@hades-ts/slash-commands";
import {
    EmbedBuilder,
} from "discord.js";
import { inject } from "inversify";

@command("ping", { description: "Ping the bot." })
export class PingCommand extends SlashCommand {
    @inject(HadesClient)
    protected client!: HadesClient;

    async execute(): Promise<void> {
        await this.interaction.reply({
            content: "Pong!",
        });
    }

    protected buildEmbeds() {
        const userEmbed = new EmbedBuilder()
            .setAuthor({
                name: this.interaction.user.username,
                iconURL: this.interaction.user.avatarURL()!,
            })

        const botEmbed = new EmbedBuilder()
            .setAuthor({
                name: this.client.user!.username,
                iconURL: this.client.user!.avatarURL()!,
            })

        return [userEmbed, botEmbed] as const;
    }
}
