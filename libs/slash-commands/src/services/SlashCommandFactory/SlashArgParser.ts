import { injectable } from 'inversify';

import { SlashArgInstaller } from '..';
import { BaseCommandInteraction } from 'discord.js';


@injectable()
export class SlashArgParser {
    name: string;
    description: string;

    async parse(arg: SlashArgInstaller, interaction: BaseCommandInteraction): Promise<any> { }
}
