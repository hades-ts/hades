import { guildSingleton, guildTokens } from "@hades-ts/guilds";
import { inject } from "inversify";
import { GuildConfig } from "../config";
import { GuildRolesChannel } from "./GuildRolesChannel";
import { GuildRoleStash } from "./GuildRoleStash";
import { GuildRuleStash } from "./GuildRuleStash";
import { GuildStashChannels } from "./GuildStashChannels";


@guildSingleton()
export class GuildService {

    @inject(guildTokens.GuildConfig)
    guildConfig!: GuildConfig;

    @inject(GuildRuleStash)
    rules!: GuildRuleStash;

    @inject(GuildRoleStash)
    roles!: GuildRoleStash;

    @inject(GuildRolesChannel)
    roleChannel!: GuildRolesChannel;

    @inject(GuildStashChannels)
    stashChannels!: GuildStashChannels;

}