import { parser } from '../decorators';
import { SlashArgParser } from './SlashArgParser';
import { SlashCommandContext } from '../models/SlashCommandContext';
import { SlashArgInstaller } from '../services/SlashCommandFactory/SlashArgInstaller';
import { GuildBasedChannel, GuildChannel, Role } from 'discord.js';


@parser()
export class RoleParser extends SlashArgParser {
    name = 'role';
    description = 'A guild role."';

    async parse(arg: SlashArgInstaller, context: SlashCommandContext) {
        const data = context.interaction.options.get(arg.name);
        return data.role as Role;
    }
}
