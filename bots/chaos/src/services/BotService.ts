import { inject } from 'inversify';
import { BaseGuildTextChannel, EmbedBuilder, Interaction, TextChannel } from 'discord.js';

import { singleton, HadesBotService } from "@hades-ts/hades";
import { SlashCommandService } from '@hades-ts/slash-commands';
import { CronService } from '../guilds/services/CronService';
import { Config } from '../config';
import { DateTime } from 'luxon';
import { GuildManager } from '../guilds';


@singleton(BotService)
export class BotService extends HadesBotService {

    @inject('cfg.guilds')
    protected configGuilds!: Config["guilds"]

    @inject(SlashCommandService)
    protected slashCommands!: SlashCommandService;

    @inject(GuildManager)
    protected guildManager!: GuildManager;

    async onReady() {
        console.log(`Logged in as ${this.client.user!.username}.`);
        await this.slashCommands.registerCommands(this.client);
        this.client.guilds.cache.forEach((guild) => {
            if (this.configGuilds[guild.id] && !this.configGuilds[guild.id].disabled) {
                this.guildManager.setupGuild(guild.id);
                console.log(` - ${guild.name} (${guild.id})`);
            }            
        });
    }

    async onInteractionCreate<T extends Interaction>(interaction: T) {
        if (interaction.isCommand()) {
            this.slashCommands.dispatch(interaction);
        }
    }    
}
