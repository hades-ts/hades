import { CommandInteraction, GuildBasedChannel } from 'discord.js';

import { parser, SlashArgInstaller, SlashArgParser } from '../../services';


@parser()
export class ChannelParser extends SlashArgParser {
    name = 'channel';
    description = 'A guild channel."';

    async parse(arg: SlashArgInstaller, interaction: CommandInteraction) {
        const data = interaction.options.get(arg.name);
        return data.channel as GuildBasedChannel;
    }
}
