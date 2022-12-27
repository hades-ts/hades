import { GuildBinder, guildTokens } from "@hades-ts/guilds"
import { singleton } from "@hades-ts/hades"
import { Container, inject } from "inversify"

import { GuildConfig } from "../config"


@singleton(guildTokens.GuildBinder)
export class ChaosGuildBinder implements GuildBinder {

    @inject('cfg.guilds')
    protected guilds!: Record<string, GuildConfig>

    async bind(guildContainer: Container) {
        const guildId = guildContainer.get<string>(guildTokens.GuildId)
        const guildConfig = this.guilds[guildId] || null
        guildContainer
            .bind(guildTokens.GuildConfig)
            .toConstantValue(guildConfig)

    }
}