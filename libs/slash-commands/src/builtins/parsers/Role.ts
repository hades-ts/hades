import { CommandInteraction, Role } from 'discord.js';
import { parser, SlashArgInstaller, SlashArgParser } from '../../services';


@parser()
export class RoleParser extends SlashArgParser {
    name = 'role';
    description = 'A guild role."';

    async parse(arg: SlashArgInstaller, interaction: CommandInteraction) {
        const data = interaction.options.get(arg.name);
        return data.role as Role;
    }
}
