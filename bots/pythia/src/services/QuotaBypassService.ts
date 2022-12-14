import { singleton } from "@hades-ts/hades";
import { GuildMember } from "discord.js";
import { inject } from "inversify";
import { ConfigGuild } from "../config";


@singleton(QuotaBypassService)
export class QuotaBypassService {

    @inject('cfg.guilds')
    protected guildsConfig: Record<string, ConfigGuild>

    @inject('cfg.botOwner')
    protected botOwner: string

    isExempted(guildId: string, member: GuildMember) {
        const id = member.id;

        if (id === this.botOwner) {
            return true;
        }
        
        const guildConfig = this.guildsConfig[guildId];

        if (guildConfig === undefined) {
            return false;
        }

        const exemptions = guildConfig.quotaExemptions;

        if (exemptions === undefined) {
            return false;
        }

        const exemptedUser = exemptions.users?.includes(id);
        const exemptedRole = exemptions.roles?.some((roleId) => member.roles.cache.has(roleId));

        return Boolean(exemptedUser || exemptedRole);
    }
}