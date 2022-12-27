
import { aiTokens } from "@hades-ts/ai"
import { GuildBinder, guildTokens } from "@hades-ts/guilds"
import { singleton } from "@hades-ts/hades"
import { Container, inject } from "inversify"

import { Config } from "../config"


@singleton(guildTokens.GuildBinder)
export class ZeusGuildBinder implements GuildBinder {

    @inject('cfg.gpt3Token')
    protected gpt3Token!: Config["gpt3Token"]

    @inject('cfg.quota')
    protected quota!: Config["quota"]

    @inject('cfg.guilds')
    protected guilds!: Config["guilds"]

    async bind(guildContainer: Container) {
        const guildId = guildContainer.get<string>(guildTokens.GuildId)
        const guildConfig = this.guilds[guildId] || null

        guildContainer
            .bind(guildTokens.GuildConfig)
            .toConstantValue(guildConfig)

        guildContainer
            .bind(aiTokens.OpenAIToken)
            .toConstantValue(this.gpt3Token)

        guildContainer
            .bind(aiTokens.TokenQuota)
            .toConstantValue(this.quota)

    }
}