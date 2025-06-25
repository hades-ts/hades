import { HadesClient } from "@hades-ts/hades";
import { command, member, role, SlashCommand } from "@hades-ts/slash-commands";
import type { GuildMember, Role } from "discord.js";
import { inject } from "inversify";

import { NotMeValidator } from "./validators/NotMeValidator";

@command("user-is", {
    description: "Check whether a user has is member of a role.",
})
export class UserIsCommand extends SlashCommand {
    @inject(HadesClient)
    protected client: HadesClient;

    @member({
        description: "Who to check the role of.",
        validators: [NotMeValidator],
    })
    who: GuildMember;

    @role({ description: "The role to check for." })
    role: Role;

    async execute() {
        console.log(JSON.stringify(this.who, null, 2));
        this.who.roles.cache.has(this.role.id)
            ? await this.followUp(
                  `Yes, <@!${this.who.id}> is a member of <@&${this.role.id}>.`,
              )
            : await this.followUp(
                  `No, <@!${this.who.id}> is not a member of <@&${this.role.id}>.`,
              );
    }
}
