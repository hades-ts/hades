import { BaseCommandInteraction, GuildMember } from 'discord.js';
import { parser, SlashArgInstaller, SlashArgParser } from '../../services';


@parser()
export class MemberParser extends SlashArgParser {
    name = 'user';
    description = 'A guild user.';

    async parse(arg: SlashArgInstaller, interaction: BaseCommandInteraction) {
        const data = interaction.options.get(arg.name);
        return data.member as GuildMember;
    }
}
