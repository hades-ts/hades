import { HadesBotService, singleton } from "@hades-ts/hades"
import { SlashCommandService } from '@hades-ts/slash-commands'
import { Interaction } from 'discord.js'
import { inject } from 'inversify'

import { Config } from '../config'
import { GuildManager } from '../guilds'


@singleton(BotService)
export class BotService extends HadesBotService {

    @inject('cfg.guilds')
    protected configGuilds!: Config["guilds"]

    @inject(SlashCommandService)
    protected slashCommands!: SlashCommandService

    @inject(GuildManager)
    protected guildManager!: GuildManager

    async onReady() {
        console.log(`Logged in as ${this.client.user!.username}.`)
        await this.slashCommands.registerCommands(this.client)
        const guilds = this.client.guilds.cache
        for (const guild of guilds.values()) {
            if (this.configGuilds[guild.id] && !this.configGuilds[guild.id].disabled) {
                await this.guildManager.setupGuild(guild.id)
                console.log(` - ${guild.name} (${guild.id})`)
            }
        }
    }

    async onInteractionCreate<T extends Interaction>(interaction: T) {
        if (interaction.isCommand()) {
            await this.slashCommands.dispatch(interaction)
        }
    }
}
