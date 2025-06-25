import { type GuildBinder, guildTokens } from "@hades-ts/guilds";
import { singleton } from "@hades-ts/hades";
import { type Container, inject } from "inversify";

import type { Config } from "../config";

@singleton(guildTokens.GuildBinder)
export class ZeusGuildBinder implements GuildBinder {
    @inject("cfg.guilds")
    protected guilds!: Config["guilds"];

    async bind(guildContainer: Container) {
        const guildId = guildContainer.get<string>(guildTokens.GuildId);
        const guildConfig = this.guilds[guildId] || null;

        guildContainer.bind(guildTokens.GuildConfig).toConstantValue(guildConfig);
    }
}
