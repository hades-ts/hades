import type { BaseInteraction, CommandInteraction } from "discord.js";
import { inject, injectable, injectFromBase } from "inversify";

import { InteractionDispatch } from "@hades-ts/interactions";

import { GuildManager } from "./GuildManager";

@injectable()
@injectFromBase({
    extendConstructorArguments: false,
    extendProperties: true,
})
export class GuildInteractionDispatch extends InteractionDispatch {
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

        return super.execute(parent, interaction as CommandInteraction);
    }
}
