import { guildSingleton, guildTokens } from "@hades-ts/guilds"
import { MarkdownStash } from "@hades-ts/stash"
import { inject } from "inversify"
import path from "path"

import { roleSchema } from "../config"


@guildSingleton()
export class GuildRoleStash {
    stash: MarkdownStash<typeof roleSchema>

    constructor(
        @inject('cfg.dataPath')
        protected readonly dataPath: string,

        @inject(guildTokens.GuildId)
        protected readonly guildId: string,
    ) {
        this.stash = new MarkdownStash<typeof roleSchema>(
            path.join(this.dataPath, this.guildId, "roles"),
            roleSchema,
        )
    }

}