import { inject } from 'inversify';
import { BaseGuildTextChannel, EmbedBuilder, Interaction, TextChannel } from 'discord.js';

import { singleton, HadesBotService } from "@hades-ts/hades";
import { SlashCommandService } from '@hades-ts/slash-commands';
import { CronService } from './CronService';
import { Config } from '../config';
import { DateTime } from 'luxon';
import { GuildManager } from '../guilds';


@singleton(BotService)
export class BotService extends HadesBotService {

    @inject('cfg.guilds')
    protected configGuilds: Config["guilds"]

    @inject(SlashCommandService)
    protected slashCommands: SlashCommandService;

    @inject(GuildManager)
    protected guildManager: GuildManager;

    async onReady() {
        console.log(`Logged in as ${this.client.user.username}.`);
        await this.slashCommands.registerCommands(this.client);
        this.client.guilds.cache.forEach((guild) => {
            this.guildManager.setupGuild(guild.id);
            console.log(` - ${guild.name} (${guild.id})`);
        });

        // // for each guild, register the cron job
        // this.client.guilds.cache.forEach((guild) => {
        //     const guildConfig = this.configGuilds[guild.id];
        //     if (!guildConfig) {
        //         return;
        //     }
        //     const cron = new CronService(guildConfig.hour, () => this.onRollover(guild.id));
        //     this._crons[guild.id] = cron;
        // });
    }

    async onInteractionCreate<T extends Interaction>(interaction: T) {
        if (interaction.isCommand()) {
            this.slashCommands.dispatch(interaction);
        }
    }    


    onRollover(guildId: string) {
        // get the channel for this guild
        // and make a new message
        const guild = this.client.guilds.cache.get(guildId);
        const guildConfig = this.configGuilds[guildId];
        const channel = guild.channels.cache.get(guildConfig.channel) as TextChannel;
        channel.send({
            content: `Chaos message for ${DateTime.now().toLocaleString({
                month: 'long',
                day: 'numeric',
                year: 'numeric',
            })}`,
            embeds: [
                new EmbedBuilder().setDescription(`No words yet!`)
            ]
        })
    }
}
