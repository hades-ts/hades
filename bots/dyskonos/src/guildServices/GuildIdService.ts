import { GuildInfo, guildSingleton, guildTokens } from "@hades-ts/guilds";
import { inject } from "inversify";
import type { Config } from "../config";

@guildSingleton()
export class GuildIdService {
    @inject(GuildInfo)
    public info!: GuildInfo<Config["guilds"]>;

    getGuildId() {
        return this.info.id;
    }
}
