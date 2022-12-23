import path from "path";

import { guildSingleton, guildTokens } from "@hades-ts/guilds";
import { MarkdownStash } from "@hades-ts/stash";
import { inject } from "inversify";
import { ruleSchema } from "../schemas";


@guildSingleton()
export class GuildRuleStash {
    stash: MarkdownStash<typeof ruleSchema>;

    constructor(
        @inject('cfg.dataPath')
        protected readonly dataPath: string,
        
        @inject(guildTokens.GuildId)
        protected readonly guildId: string,
    ) {
        this.stash = new MarkdownStash<typeof ruleSchema>(
            path.join(this.dataPath, this.guildId, "rules"),
            ruleSchema,
        )
    }

}