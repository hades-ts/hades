import { HadesBotService, singleton } from "@hades-ts/hades";
import { SlashCommandService } from "@hades-ts/slash-commands";
import type { Interaction } from "discord.js";
import { inject } from "inversify";

@singleton()
export class BotService extends HadesBotService {
    @inject(SlashCommandService)
    protected slashCommands: SlashCommandService;

    async onReady() {
        console.log(`Logged in as ${this.client.user.username}.`);
        await this.slashCommands.registerCommands(this.client);
        this.client.guilds.cache.forEach((guild) => {
            console.log(` - ${guild.name} (${guild.id})`);
        });
    }

    async onInteractionCreate<T extends Interaction>(interaction: T) {
        if (interaction.isCommand()) {
            this.slashCommands.dispatch(interaction);
        }
    }
}
