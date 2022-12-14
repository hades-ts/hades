import { GuildMember } from "discord.js";
import { inject, optional, postConstruct } from "inversify";

import { singleton } from "@hades-ts/hades";

import { AuthzGuildError, NoAuthzError } from "../errors";


export type GuildConfig = {
    users?: string[],
    roles?: string[]
}


@singleton(AuthzService)
export class AuthzService {

    @optional()
    @inject('cfg.guilds')
    guilds: Record<string, GuildConfig>;

    @inject('cfg.botOwner')
    botOwner: string;    

    @postConstruct()
    init() {
        this.guilds = this.guilds || {};
    }

    getGuildConfig(member: GuildMember) {
        return this.guilds[member.guild.id];
    }

    isOwner(member: GuildMember) {
        return this.botOwner === member.id;
    }

    isValidUser(guildConfig: GuildConfig, member: GuildMember) {
        if (!('users' in guildConfig)) {
            return null;
        }

        const users = guildConfig.users || [];
        return users.includes(member.id);
    }

    hasRequiredRole(guild: GuildConfig, member: GuildMember) {
        if (!('roles' in guild)) {
            return null;
        }

        for (const role of guild.roles || []) {
            if (member.roles.cache.has(role)) {
                return true
            }
        }
        return false;
    }

    checkAccess(member: GuildMember) {
        if (this.isOwner(member)) {
            return true
        }
        
        const guild = this.getGuildConfig(member);

        if (!guild) {
            throw new AuthzGuildError(`I'm not allowed to do that on this server.`)
        }

        const isValidUser = this.isValidUser(guild, member)
        const hasRequiredRole = this.hasRequiredRole(guild, member); 

        if (isValidUser === null && hasRequiredRole === null) {
            return;
        }

        if (isValidUser === null && hasRequiredRole === true) {
            return;
        }

        if (isValidUser === true && hasRequiredRole === null) {
            return;
        }

        if (isValidUser === true && hasRequiredRole === true) {
            return;
        }

        throw new NoAuthzError(`You are not authorized to use this command.`);
    }

}