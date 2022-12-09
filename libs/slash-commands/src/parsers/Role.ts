import { parser } from '../decorators';
import { SlashArgParser } from './SlashArgParser';
import { SlashArgInstaller } from '../services/SlashCommandFactory/SlashArgInstaller';
import { BaseCommandInteraction, Role } from 'discord.js';


@parser()
export class RoleParser extends SlashArgParser {
    name = 'role';
    description = 'A guild role."';

    async parse(arg: SlashArgInstaller, interaction: BaseCommandInteraction) {
        const data = interaction.options.get(arg.name);
        return data.role as Role;
    }
}
