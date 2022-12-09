import { HadesClient } from "@hades-ts/hades";
import { command, SlashCommand, role, member, validate, SlashArgError } from "@hades-ts/slash-commands";
import { GuildMember, Role } from "discord.js";
import { inject } from "inversify";
import { NotMeValidator } from "./validators/NotMeValidator";


@command("user-is", { description: "Check whether a user has is member of a role." })
export class UserIsCommand extends SlashCommand {

    @inject(HadesClient)
    client: HadesClient;

    @NotMeValidator.check()
    @member({ description: "Who to check the role of." })
    who: GuildMember;

    @role({ description: "The role to check for." })
    role: Role;

    // @validate("who")
    // async validateWho() {
    //     console.log("Validating 'who'.")
    //     if (this.who.id === this.client.user.id) {
    //         throw new SlashArgError("You can't check my roles ;)");
    //     }
    // }

    async execute() {
        console.log(JSON.stringify(this.who, null, 2));
        this.who.roles.cache.has(this.role.id)
            ? await this.followUp(`Yes, <@!${this.who.id}> is a member of <@&${this.role.id}>.`)
            : await this.followUp(`No, <@!${this.who.id}> is not a member of <@&${this.role.id}>.`);
    }
}