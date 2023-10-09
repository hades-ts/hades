import { GuildManager } from "@hades-ts/guilds";
import { HadesBotService, singleton } from "@hades-ts/hades";
import { SlashCommandService } from "@hades-ts/slash-commands";
import { Interaction } from "discord.js";
import { inject } from "inversify";

import { GuildService } from "../guildServices";

@singleton(BotService)
export class BotService extends HadesBotService {
    @inject(SlashCommandService)
    protected slashCommands!: SlashCommandService;

    @inject(GuildManager)
    protected guildManager!: GuildManager;

    async onReady() {
        console.log(`Logged in as ${this.client.user!.username}.`);
        await this.slashCommands.registerCommands(this.client);
        const guilds = this.client.guilds.cache.values();
        for (const guild of guilds) {
            console.log(` - ${guild.name} (${guild.id})`);
            // prewarm guild services
            const guildContainer = await this.guildManager.get(guild);
            guildContainer.get(GuildService);
        }
    }

    async onInteractionCreate<T extends Interaction>(interaction: T) {
        await this.slashCommands.dispatch(interaction);
    }
}
