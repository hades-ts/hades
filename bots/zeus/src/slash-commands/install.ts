import { GuildManager } from "@hades-ts/guilds";
import { HadesClient } from "@hades-ts/hades";
import { SlashCommand, command } from "@hades-ts/slash-commands";

import { inject } from "inversify";
import { GuildServiceFactory } from "../services";


@command("install", { description: "Setup the configured role channel." })
export class InstallRoleChannelCommand extends SlashCommand {

    @inject(HadesClient)
    client!: HadesClient;

    @inject(GuildManager)
    guildManager!: GuildManager;

    @inject(GuildServiceFactory)
    guildServiceFactory!: GuildServiceFactory;

    protected async reject(content: string) {
        try {
            await this.interaction.deferReply({
                ephemeral: true,
            })
            await this.interaction.editReply({
                content,
            })
        } catch (error) {
            console.error(`Couldn't reply to user:`, error);
        }
    }

    async execute(): Promise<void> {
        const guildService = await this.guildServiceFactory.getGuildService(this.interaction.guild!);

        if (!guildService.guildConfig.rolesChannel) {
            await this.reject(`Hmm, no a role channel is configured!`);
            return;
        }

        await this.interaction.deferReply({
            ephemeral: true,
        });

        await guildService.roleChannel.install();
        await guildService.stashChannels.install();

        await this.interaction.followUp({
            content: `Channels updated!`,
            ephemeral: true,
        });
    }

}