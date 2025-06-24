import { CommandInteraction } from "discord.js";
import { injectable } from "inversify";

import { SlashArgInstaller } from "..";

@injectable()
export class SlashArgParser {
    name: string;
    description: string;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async parse(arg: SlashArgInstaller, interaction: CommandInteraction): Promise<any> {}
}
