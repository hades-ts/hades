import { guildSingleton, guildTokens } from "@hades-ts/guilds";
import { inject } from "inversify";
import { GuildConfig } from "../config";
import { GuildRoleStash } from "./GuildRoleStash";
import { GuildRuleStash } from "./GuildRuleStash";
import { GuildStashChannels } from "./GuildStashChannels";
import { RoleButtonListener } from "./RoleButtonListener";


@guildSingleton()
export class GuildService {

    @inject(guildTokens.GuildId)
    guildId!: string;

    @inject(guildTokens.GuildConfig)
    guildConfig!: GuildConfig;

    @inject(GuildRuleStash)
    rules!: GuildRuleStash;

    @inject(GuildRoleStash)
    roles!: GuildRoleStash;

    @inject(GuildStashChannels)
    stashChannels!: GuildStashChannels;

    @inject(RoleButtonListener)
    roleButtonListener!: RoleButtonListener;

}