import { ChatInputCommandInteraction } from "discord.js";

import { parser, SlashArgInstaller, SlashArgParser } from "../../services";

@parser()
export class UserParser extends SlashArgParser {
    name = "user";
    description = "A guild user.";

    async parse(arg: SlashArgInstaller, interaction: ChatInputCommandInteraction) {
        const data = interaction.options.get(arg.name);
        return data.user;
    }
}
