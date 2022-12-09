import { HadesClient } from "@hades-ts/hades";
import { SlashArgError, SlashArgInstaller, Validator } from "@hades-ts/slash-commands";
import { BaseCommandInteraction, GuildMember } from "discord.js";
import { inject } from "inversify";


export class NotMeValidator extends Validator {

    @inject(HadesClient)
    client: HadesClient;

    async validate(arg: SlashArgInstaller, interaction: BaseCommandInteraction) {
        const member = interaction.options.get(arg.name).member as GuildMember;
        if (member.id === this.client.user.id) {
            throw new SlashArgError("You can't use this command on me.");
        }
    }
}