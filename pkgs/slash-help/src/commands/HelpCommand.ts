import type { EmbedBuilder } from "discord.js";
import { inject } from "inversify";

import {
    command,
    commandName,
    SlashArgError,
    SlashCommand,
    validate,
} from "@hades-ts/slash-commands";

import { SlashCommandHelpService } from "../services";

@command("help", { description: `Get help for my commands.` })
export class HelpCommand extends SlashCommand {
    @commandName({
        required: true,
        description: "Name of the command.",
    })
    protected commandName!: string;

    @inject(SlashCommandHelpService)
    protected helpService!: SlashCommandHelpService;

    private helpEmbed!: EmbedBuilder;

    @validate("commandName")
    validateCommandName() {
        this.helpEmbed = this.helpService.getHelpEmbed(this.commandName);

        if (!this.helpEmbed) {
            throw new SlashArgError(
                `Couldn't find a "${this.commandName}" command. :weary:`,
            );
        }
    }

    async execute() {
        await this.reply("Here's what I've got:", { embeds: [this.helpEmbed] });
    }
}
