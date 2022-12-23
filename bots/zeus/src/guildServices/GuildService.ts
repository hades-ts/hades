import { guildSingleton, guildTokens } from "@hades-ts/guilds";
import { inject } from "inversify";
import { GuildConfig } from "../config";
import { GuildRoleChannelManager } from "./GuildRoleChannelManager";
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

    @inject(GuildRoleChannelManager)
    roleChannel!: GuildRoleChannelManager;

    @inject(GuildStashChannels)
    stashChannels!: GuildStashChannels;

}