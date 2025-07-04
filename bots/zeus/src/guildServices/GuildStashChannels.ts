import path from "path";

import { inject, postConstruct } from "inversify";

import { HadesClient } from "@hades-ts/core";
import { guildSingleton, guildTokens } from "@hades-ts/guilds";
import { MultiSync } from "@hades-ts/sync";

import type { GuildConfig } from "../config";

@guildSingleton()
export class GuildStashChannels {
    @inject("cfg.dataPath")
    protected readonly dataPath!: string;

    @inject(HadesClient)
    protected client!: HadesClient;

    @inject(guildTokens.GuildId)
    protected guildId!: string;

    @inject(guildTokens.GuildConfig)
    protected guildConfig!: GuildConfig;

    protected multiSync!: MultiSync;

    @postConstruct()
    protected init() {
        this.multiSync = new MultiSync(
            this.client,
            path.join(this.dataPath, this.guildId),
            this.guildConfig.stashChannels,
        );
    }

    async sync() {
        await this.multiSync.sync();
    }
}
