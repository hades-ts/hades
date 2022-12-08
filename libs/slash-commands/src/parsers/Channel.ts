import { parser } from '../decorators';
import { SlashArgParser } from './SlashArgParser';
import { SlashCommandContext } from '../models/SlashCommandContext';
import { SlashArgInstaller } from '../services/SlashCommandFactory/SlashArgInstaller';
import { GuildBasedChannel, GuildChannel } from 'discord.js';


@parser()
export class ChannelParser extends SlashArgParser {
    name = 'channel';
    description = 'A guild channel."';

    async parse(arg: SlashArgInstaller, context: SlashCommandContext) {
        const data = context.interaction.options.get(arg.name);
        return data.channel as GuildBasedChannel;
    }
}
