import { ChatInputCommandInteraction, Role } from "discord.js";

import { SlashArgInstaller, SlashArgParser } from "../../services";

export class RoleParser extends SlashArgParser {
    override name = "role";
    override description = 'A guild role."';

    override async parse(arg: SlashArgInstaller, interaction: ChatInputCommandInteraction) {
        const data = interaction.options.get(arg.name);
        if (!data) {
            throw new Error(`Role ${arg.name} not found`);
        }
        return data.role;
    }
}
