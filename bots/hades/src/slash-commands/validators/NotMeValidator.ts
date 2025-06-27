import { HadesClient } from "@hades-ts/core";
import {
    SlashArgError,
    SlashArgInstaller,
    Validator,
} from "@hades-ts/slash-commands";
import { CommandInteraction, type GuildMember } from "discord.js";
import { inject, injectable } from "inversify";

@injectable()
export class NotMeValidator extends Validator<GuildMember> {
    @inject(HadesClient)
    protected client: HadesClient;

    async validate(member: GuildMember) {
        if (member.id === this.client.user.id) {
            throw new SlashArgError("You can't use this command on me.");
        }
    }
}
