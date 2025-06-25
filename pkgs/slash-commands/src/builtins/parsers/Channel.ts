import type {
    ChatInputCommandInteraction,
    CommandInteractionOptionResolver,
} from "discord.js";

import { type SlashArgInstaller, SlashArgParser } from "../../services";

export class ChannelParser extends SlashArgParser {
    override name = "channel";
    override description = 'A guild channel."';

    override async parse(
        arg: SlashArgInstaller,
        interaction: ChatInputCommandInteraction,
    ): Promise<ReturnType<CommandInteractionOptionResolver["getChannel"]>> {
        return interaction.options.getChannel(arg.name);
    }
}
