import { ChatInputCommandInteraction, CommandInteractionOptionResolver } from "discord.js";

import { parser, SlashArgInstaller, SlashArgParser } from "../../services";

@parser()
export class ChannelParser extends SlashArgParser {
    name = "channel";
    description = 'A guild channel."';

    async parse(arg: SlashArgInstaller, interaction: ChatInputCommandInteraction): Promise<ReturnType<CommandInteractionOptionResolver['getChannel']>> {
        return interaction.options.getChannel(arg.name);
    }
}
