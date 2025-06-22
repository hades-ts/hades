import { guildSingleton, guildTokens } from "@hades-ts/guilds";
import { inject } from "inversify";

import { type GuildConfig } from "../config";
import { GuildRoleStash } from "./GuildRoleStash";
import { GuildRuleStash } from "./GuildRuleStash";
import { GuildStashChannels } from "./GuildStashChannels";
import { RoleButtonListener } from "./RoleButtonListener";

@guildSingleton()
export class GuildService {
    @inject(guildTokens.GuildId)
    public guildId!: string;

    @inject(guildTokens.GuildConfig)
    public guildConfig!: GuildConfig;

    @inject(GuildRuleStash)
    public rules!: GuildRuleStash;

    @inject(GuildRoleStash)
    public roles!: GuildRoleStash;

    @inject(GuildStashChannels)
    public stashChannels!: GuildStashChannels;

    @inject(RoleButtonListener)
    public roleButtonListener!: RoleButtonListener;
}
