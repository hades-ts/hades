import { injectable } from 'inversify';

import { SlashArgInstaller } from '..';
import { CommandInteraction } from 'discord.js';


@injectable()
export class SlashArgParser {
    name: string;
    description: string;

    async parse(arg: SlashArgInstaller, interaction: CommandInteraction): Promise<any> { }
}
