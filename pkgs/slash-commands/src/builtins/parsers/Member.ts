import { type ChatInputCommandInteraction, GuildMember } from "discord.js";

import { type SlashArgInstaller, SlashArgParser } from "../../services";

export class MemberParser extends SlashArgParser {
    override name = "user";
    override description = "A guild user.";

    override async parse(arg: SlashArgInstaller, interaction: ChatInputCommandInteraction) {
        const data = interaction.options.get(arg.name);
        if (!data) {
            throw new Error(`Member ${arg.name} not found`);
        }
        return data.member;
    }
}
