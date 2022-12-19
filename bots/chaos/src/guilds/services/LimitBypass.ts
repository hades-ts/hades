import { GuildMember } from "discord.js";
import { inject } from "inversify";
import { ConfigGuild } from "../../config";
import { guildSingleton } from "../decorators";
import { tokens } from "../tokens";
import { DataService } from "./DataService";


@guildSingleton()
export class LimitBypass {

    @inject('cfg.botOwner')
    protected botOwner!: string;

    @inject(tokens.GuildConfig)
    protected config!: ConfigGuild;

    @inject(tokens.GuildOwner)
    protected guildOwner!: string;

    @inject(DataService)
    protected dataService!: DataService;

    getData() {
        const data = this.dataService.getData();
        if (data === null) {
            throw new Error('No data found');
        }

        return data;
    }

    isExempt(member: GuildMember) {
        const data = this.getData();

        if (member.id === this.botOwner) {
            return true;
        }

        if (member.id === this.guildOwner) {
            return true;
        }

        if (this.config.exemptedRoles?.some(role => member.roles.cache.has(role))) {
            return true;
        }

        if (this.config.exemptedUsers?.includes(member.id)) {
            return true;
        }

        if (data.users.find(user => user.id === member.id) === undefined) {
            return true;
        }

        return false
    }
}