import path from "path";

import { inject } from "inversify";

import { guildSingleton, guildTokens } from "@hades-ts/guilds";
import { MarkdownStash } from "@hades-ts/stash";

import { type RuleConfig, ruleSchema } from "../config";

@guildSingleton()
export class GuildRuleStash {
    stash: MarkdownStash<RuleConfig>;

    constructor(
        @inject("cfg.dataPath")
        protected readonly dataPath: string,

        @inject(guildTokens.GuildId)
        protected readonly guildId: string,
    ) {
        this.stash = new MarkdownStash<RuleConfig>(
            path.join(this.dataPath, this.guildId, "rules"),
            ruleSchema,
        );
    }
}
