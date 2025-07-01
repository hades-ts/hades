import { HadesClient } from "@hades-ts/core";
import { GuildInfo, guildSingleton } from "@hades-ts/guilds";
import type { Message } from "discord.js";
import { inject } from "inversify";
import type { GuildConfig } from "../config";
import { MessageChainFormatter } from "./MessageChainFormatter";

@guildSingleton()
export class RoleInfoService {
    @inject(HadesClient)
    protected client!: HadesClient;

    @inject(GuildInfo)
    protected guildInfo!: GuildInfo<GuildConfig>;

    get guild() {
        return this.guildInfo.fetch();
    }

    async fetchAllRoles() {
        const guild = await this.guild;
        const roles = guild.roles.cache.map((r) => ({
            id: r.id,
            name: r.name,
            color: r.color,
            hoist: r.hoist,
            position: r.position,
        }));
        roles.sort((a, b) => b.position - a.position);
        return JSON.stringify(roles, null, 2);
    }

    async fetchUserRoles(userId: string) {
        const guild = await this.guild;
        const member = await guild.members.fetch(userId);
        const roles = member.roles.cache.map((r) => ({
            id: r.id,
            name: r.name,
        }));
        return JSON.stringify(roles, null, 2);
    }

    async fetchUsersInRole(roleId: string) {
        console.log("Fetching users in role:", roleId);
        const guild = await this.guild;
        console.log("Guild:", guild.id);
        console.log("Fetching members...");
        await guild.members.fetch();
        console.log("Members fetched:", guild.members.cache.size);

        const roleMembers = [];

        for (const member of Array.from(guild.members.cache.values())) {
            console.log("Member:", member.id);
            if (member.roles.cache.has(roleId)) {
                console.log("Member has role:", member.id);
                roleMembers.push(member);
            }
        }

        const users = roleMembers.map((u) => ({
            id: u.id,
            name: u.displayName,
        }));

        return JSON.stringify(users, null, 2);
    }
}
