import { parser } from '../decorators';
import { SlashArgParser } from './SlashArgParser';
import { SlashArgInstaller } from '../services/SlashCommandFactory/SlashArgInstaller';
import { BaseCommandInteraction } from 'discord.js';


@parser()
export class StringParser extends SlashArgParser {
    name = 'string';
    description = 'Anything really. Use "quote for spaces"."';

    async parse(arg: SlashArgInstaller, interaction: BaseCommandInteraction) {
        const data = interaction.options.get(arg.name);
        return data.value;
    }
}
