import path from "path";

import { GuildBinder, guildTokens } from "@hades-ts/guilds";
import { singleton } from "@hades-ts/hades";
import { MarkdownStash } from "@hades-ts/stash";
import { Container, inject, interfaces } from "inversify";
import { GuildConfig } from "../config";
import { ruleSchema } from "../schemas";


@singleton(guildTokens.GuildBinder)
export class ZeusGuildBinder implements GuildBinder {

    @inject('cfg.guilds')
    guilds!: Record<string, GuildConfig>

    async bind(guildContainer: Container) {
        const guildId = guildContainer.get<string>(guildTokens.GuildId);
        const guildConfig = this.guilds[guildId] || null;

        guildContainer
            .bind(guildTokens.GuildConfig)
            .toConstantValue(guildConfig);

        guildContainer
            .bind(MarkdownStash)
            .toDynamicValue((context: interfaces.Context) => {
                const container = context.container;
                const rulesPath = container.get<string>('cfg.rulesPath');
                const guildRulesPath = path.join(rulesPath, guildId);
                return new MarkdownStash(guildRulesPath, ruleSchema);
            })
    }
}