import { ChatInputCommandInteraction } from "discord.js";

import { parser } from "./parser";
import { SlashArgInstaller } from "./SlashArgInstaller";
import { SlashArgParser } from "./SlashArgParser";

@parser()
export class StringParser extends SlashArgParser {
    name = "string";
    description = 'Anything really. Use "quote for spaces"."';

    async parse(arg: SlashArgInstaller, interaction: ChatInputCommandInteraction) {
        const data = interaction.options.get(arg.name);
        return data.value;
    }
}
