import { parser } from '../decorators';
import { SlashArgParser } from './SlashArgParser';
import { SlashArgInstaller } from '../services/SlashCommandFactory/SlashArgInstaller';
import { BaseCommandInteraction } from 'discord.js';


@parser()
export class UserParser extends SlashArgParser {
    name = 'user';
    description = 'A guild user.';

    async parse(arg: SlashArgInstaller, interaction: BaseCommandInteraction) {
        const data = interaction.options.get(arg.name);
        return data.user;
    }
}
