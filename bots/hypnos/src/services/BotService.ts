import { GuildManager } from '@hades-ts/guilds'
import { HadesBotService, singleton } from "@hades-ts/hades"
import { SlashCommandService } from '@hades-ts/slash-commands'
import { Interaction } from 'discord.js'
import { inject } from 'inversify'

import { GuildConfig } from '../config'
import { GuildService } from '../guildServices'
import { ThreadStarterService } from './ThreadStarterService'


@singleton(BotService)
export class BotService extends HadesBotService {

    @inject('cfg.guilds')
    protected guilds!: Record<string, GuildConfig>

    @inject(SlashCommandService)
    protected slashCommands!: SlashCommandService

    @inject(ThreadStarterService)
    protected threadStarter!: ThreadStarterService

    @inject(GuildManager)
    protected guildManager!: GuildManager

    async onReady() {
        console.log(`Logged in as ${this.client.user!.username}.`)
        await this.slashCommands.registerCommands(this.client)
        const guilds = this.client.guilds.cache.values()
        for (const guild of guilds) {
            const guildConfig = this.guilds[guild.id]
            if (!guildConfig) {
                console.log(` - ${guild.name} (${guild.id}) is not configured`)
                continue
            }
            console.log(` - ${guild.name} (${guild.id})`)
            const guildContainer = await this.guildManager.get(guild)
            guildContainer.get(GuildService)
        }
    }

    async onInteractionCreate<T extends Interaction>(interaction: T) {
        if (interaction.isCommand()) {
            await this.slashCommands.dispatch(interaction)
        }
    }
}
