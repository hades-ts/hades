import { parser } from '../decorators';
import { SlashArgParser } from './SlashArgParser';
import { SlashCommandContext } from '../models/SlashCommandContext';
import { SlashArgInstaller } from '../services/SlashCommandFactory/SlashArgInstaller';
import { GuildMember } from 'discord.js';


@parser()
export class MemberParser extends SlashArgParser {
    name = 'user';
    description = 'A guild user.';

    async parse(arg: SlashArgInstaller, context: SlashCommandContext) {
        const data = context.interaction.options.get(arg.name);
        return data.member as GuildMember;
    }
}
