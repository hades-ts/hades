import { GuildInfo, guildSingleton } from "@hades-ts/guilds";
import { TextStash } from "@hades-ts/stash";
import { inject } from "inversify";
import type { GuildConfig } from "../config";

@guildSingleton()
export class ResourceStash extends TextStash {
    constructor(@inject(GuildInfo) guildInfo: GuildInfo<GuildConfig>) {
        super(`stashes/resources/${guildInfo.id}`);
    }
}
