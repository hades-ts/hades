import { guildSingleton, guildTokens } from "@hades-ts/guilds";
import { GuildMember } from "discord.js";
import { inject } from "inversify";

import { GuildConfig } from "../../config";
import { WithRequired } from "../../types";
import { DataService } from "./DataService";

@guildSingleton()
export class LimitBypass {
    @inject("cfg.botOwner")
    protected botOwner!: string;

    @inject(guildTokens.GuildConfig)
    protected config!: WithRequired<GuildConfig, "channel">;

    @inject(DataService)
    protected dataService!: DataService;

    getData() {
        const data = this.dataService.getData();
        if (data === null) {
            throw new Error("No data found");
        }

        return data;
    }

    isExempt(member: GuildMember) {
        const data = this.getData();

        if (member.id === this.botOwner) {
            return true;
        }

        if (member.id === member.guild.ownerId) {
            return true;
        }

        if (this.config.exemptions?.roles?.some((role) => member.roles.cache.has(role))) {
            return true;
        }

        if (this.config.exemptions?.users?.includes(member.id)) {
            return true;
        }

        if (data.users.find((user) => user.id === member.id) === undefined) {
            return true;
        }

        return false;
    }
}
