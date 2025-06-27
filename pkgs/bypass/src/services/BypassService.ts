import { singleton } from "@hades-ts/core";
import type { GuildMember } from "discord.js";

import type { BypassConfig } from "../schema";

@singleton()
export class BypassService {
    // eslint-disable-next-line no-useless-constructor
    constructor(protected config: BypassConfig) {}

    isExempted(member: GuildMember) {
        const id = member.id;

        if (this.config.guildOwner && id === member.guild.ownerId) {
            return true;
        }

        const exemptedUsers = this.config.users || [];
        const exemptedRoles = this.config.roles || [];

        const exemptedUser = exemptedUsers.includes(id);
        const exemptedRole = exemptedRoles.some((roleId) =>
            member.roles.cache.has(roleId),
        );

        return Boolean(exemptedUser || exemptedRole);
    }
}
