import { command, SlashCommand, role, member } from "@hades-ts/slash-commands";
import { GuildMember, Role } from "discord.js";


@command("user-is", { description: "Check whether a user has is member of a role." })
export class UserIsCommand extends SlashCommand {

    @member({ description: "Who to check the role of." })
    who: GuildMember;

    @role({ description: "The role to check for." })
    role: Role;

    async execute() {
        console.log(JSON.stringify(this.who, null, 2));
        return this.who.roles.cache.has(this.role.id)
            ? this.reply(`Yes, <@!${this.who.id}> is a member of <@&${this.role.id}>.`)
            : this.reply(`No, <@!${this.who.id}> is not a member of <@&${this.role.id}>.`);
    }
}