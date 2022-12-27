import { GuildManager } from "@hades-ts/guilds"
import { singleton } from "@hades-ts/hades"
import { Guild } from "discord.js"
import { inject } from "inversify"

import { GuildService } from "../guilds"


@singleton(GuildServiceFactory)
export class GuildServiceFactory {

    @inject(GuildManager)
    protected guildManager!: GuildManager

    async getGuildService(guild: Guild) {
        const guildContainer = await this.guildManager.get(guild)
        return guildContainer.get(GuildService)
    }

}