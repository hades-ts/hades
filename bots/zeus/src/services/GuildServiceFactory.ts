import { GuildManager } from "@hades-ts/guilds";
import { singleton } from "@hades-ts/hades";
import type { Guild } from "discord.js";
import { inject } from "inversify";

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
