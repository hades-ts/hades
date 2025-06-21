import { command, SlashCommand } from "@hades-ts/slash-commands";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

import ui from "./test";

@command("tsx", { description: "Test the tsx library." })
export class TSXTestCommand extends SlashCommand {
    async execute(): Promise<void> {
        await this.interaction.reply({
            content: "Hello, world!",
            ...ui
        });
    }
}
