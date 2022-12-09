import { parser } from '../decorators';
import { SlashArgParser } from './SlashArgParser';
import { SlashArgInstaller } from '../services/SlashCommandFactory/SlashArgInstaller';
import { BaseCommandInteraction, GuildBasedChannel } from 'discord.js';


@parser()
export class ChannelParser extends SlashArgParser {
    name = 'channel';
    description = 'A guild channel."';

    async parse(arg: SlashArgInstaller, interaction: BaseCommandInteraction) {
        const data = interaction.options.get(arg.name);
        return data.channel as GuildBasedChannel;
    }
}
