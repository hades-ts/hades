import { GuildManager } from "@hades-ts/guilds";
import { HadesClient } from "@hades-ts/hades";
import { command, SlashCommand } from "@hades-ts/slash-commands";
import { inject } from "inversify";

import { GuildServiceFactory } from "../services";

@command("install", { description: "Setup the configured role channel." })
export class InstallRoleChannelCommand extends SlashCommand {
    @inject(HadesClient)
    protected client!: HadesClient;

    @inject(GuildManager)
    protected guildManager!: GuildManager;

    @inject(GuildServiceFactory)
    protected guildServiceFactory!: GuildServiceFactory;

    protected async reject(content: string) {
        try {
            await this.interaction.deferReply({
                ephemeral: true,
            });
            await this.interaction.editReply({
                content,
            });
        } catch (error) {
            console.error(`Couldn't reply to user:`, error);
        }
    }

    async execute(): Promise<void> {
        const guildService = await this.guildServiceFactory.getGuildService(this.interaction.guild!);

        await this.interaction.deferReply({
            ephemeral: true,
        });

        await guildService.stashChannels.sync();

        await this.interaction.followUp({
            content: `Channels updated!`,
            ephemeral: true,
        });
    }
}
