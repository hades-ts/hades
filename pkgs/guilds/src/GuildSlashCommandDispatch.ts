import type { BaseInteraction, CommandInteraction } from "discord.js";
import { inject, injectable, injectFromBase } from "inversify";

import { SlashCommandDispatch } from "@hades-ts/slash-commands";

import { GuildManager } from "./GuildManager";

@injectable()
@injectFromBase({
    extendConstructorArguments: false,
    extendProperties: true,
})
export class GuildSlashCommandDispatch extends SlashCommandDispatch {
    @inject(GuildManager)
    protected guildManager!: GuildManager;

    override async dispatch(interaction: BaseInteraction): Promise<void> {
        let parent = this.container;

        if (interaction.guild) {
            const guildContainer = await this.guildManager.get(
                interaction.guild,
            );
            parent = guildContainer;
        }

        return super.route(parent, interaction as CommandInteraction);
    }
}
