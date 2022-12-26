import { HadesClient, HadesContainer, singleton } from "@hades-ts/hades"
import { TextChannel } from "discord.js"
import { inject } from "inversify"

import { ConfigGuild } from "../config"
import { makeGuildContainer } from "./decorators"
import { GuildService } from "./GuildService"
import { tokens } from "./tokens"


@singleton(GuildManager)
export class GuildManager {
    protected guilds: Record<string, GuildService> = {}

    @inject(HadesContainer)
    protected container!: HadesContainer

    @inject(HadesClient)
    protected client!: HadesClient

    async setupGuild(guildId: string) {
        const guild = await this.client.guilds.fetch(guildId)
        const guildConfigs = this.container.get<Record<string, ConfigGuild>>('cfg.guilds')
        const guildConfig = guildConfigs[guildId]

        if (!guildConfig) {
            return null
        }

        try {
            if (guildConfig.channel) {
                await this.client.channels.fetch(guildConfig.channel.id) as TextChannel
            }
        } catch (e) {
            console.error(`[GuildManager] Channel ${guildConfig.channel} does not exist for guild ${guildId}`)
            return null
        }

        const subContainer = makeGuildContainer(this.container)

        subContainer
            .bind(tokens.GuildContainer)
            .toConstantValue(subContainer)

        subContainer
            .bind(tokens.GuildId)
            .toConstantValue(guildId)

        subContainer
            .bind(tokens.GuildConfig)
            .toConstantValue(guildConfig)

        subContainer
            .bind(tokens.GuildOwner)
            .toConstantValue(guild.ownerId)

        subContainer
            .bind(tokens.GuildFactory)
            .toConstantValue(async () => this.client.guilds.fetch(guildId))

        this.guilds[guildId] = subContainer.get(GuildService)

        return this.guilds[guildId]
    }

    async getGuild(guildId: string) {
        return this.guilds[guildId] || (await this.setupGuild(guildId))
    }

}