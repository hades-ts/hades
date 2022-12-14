import { inject } from 'inversify';
import { Interaction } from 'discord.js';

import { singleton, HadesBotService } from "@hades-ts/hades";
import { SlashCommandService } from '@hades-ts/slash-commands';


@singleton(BotService)
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
