import path from "path";

import { type Container, inject, type ResolutionContext } from "inversify";

import { singleton } from "@hades-ts/core";
import { type GuildBinder, guildTokens } from "@hades-ts/guilds";
import { MarkdownStash } from "@hades-ts/stash";

import { type GuildConfig, ruleSchema } from "../config";

@singleton(guildTokens.GuildBinder)
export class ZeusGuildBinder implements GuildBinder {
    @inject("cfg.guilds")
    protected guilds!: Record<string, GuildConfig>;

    async bind(guildContainer: Container) {
        const guildId = guildContainer.get<string>(guildTokens.GuildId);
        const guildConfig = this.guilds[guildId] || null;

        guildContainer
            .bind(guildTokens.GuildConfig)
            .toConstantValue(guildConfig);

        guildContainer
            .bind(MarkdownStash)
            .toDynamicValue((context: ResolutionContext) => {
                const rulesPath = context.get<string>("cfg.rulesPath");
                const guildRulesPath = path.join(rulesPath, guildId);
                return new MarkdownStash(guildRulesPath, ruleSchema);
            });
    }
}
