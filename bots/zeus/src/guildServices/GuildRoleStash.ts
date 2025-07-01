import { guildSingleton, guildTokens } from "@hades-ts/guilds";
import { MarkdownStash } from "@hades-ts/stash";
import { inject } from "inversify";
import path from "path";

import { type RoleConfig, roleSchema } from "../config";

@guildSingleton()
export class GuildRoleStash {
    stash: MarkdownStash<RoleConfig>;

    constructor(
        @inject("cfg.dataPath")
        protected readonly dataPath: string,

        @inject(guildTokens.GuildId)
        protected readonly guildId: string,
    ) {
        this.stash = new MarkdownStash<RoleConfig>(
            path.join(this.dataPath, this.guildId, "roles"),
            roleSchema,
        );
    }
}
