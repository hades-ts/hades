import type { Guild } from "discord.js";
import { inject } from "inversify";

import { singleton } from "@hades-ts/core";
import { GuildManager } from "@hades-ts/guilds";

import { GuildService } from "../guildServices";

@singleton()
export class GuildServiceFactory {
    @inject(GuildManager)
    protected guildManager!: GuildManager;

    async getGuildService(guild: Guild) {
        const guildContainer = await this.guildManager.get(guild);
        return guildContainer.get(GuildService);
    }
}
