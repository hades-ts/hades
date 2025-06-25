import type { ChatInputCommandInteraction } from "discord.js";

import type { SlashArgInstaller } from "./SlashArgInstaller";
import { SlashArgParser } from "./SlashArgParser";

export class StringParser extends SlashArgParser {
    override name = "string";
    override description = 'Anything really. Use "quote for spaces"."';

    override async parse(arg: SlashArgInstaller, interaction: ChatInputCommandInteraction) {
        const data = interaction.options.get(arg.name);
        if (!data) {
            throw new Error(`String ${arg.name} not found`);
        }
        return data.value;
    }
}
