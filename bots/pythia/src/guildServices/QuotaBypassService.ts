import type { GuildMember } from "discord.js";
import { inject, postConstruct } from "inversify";

import type { BypassService } from "@hades-ts/bypass";
import { guildSingleton, guildTokens } from "@hades-ts/guilds";

import type { GuildConfig } from "../config";

@guildSingleton()
export class QuotaBypassService {
    @inject(guildTokens.GuildConfig)
    protected guildConfig!: GuildConfig;

    protected bypass!: BypassService;

    @postConstruct()
    protected init() {
        // this.bypass = new BypassService(this.guildConfig.bypass);
    }

    isExempted(member: GuildMember) {
        return this.bypass.isExempted(member);
    }
}
