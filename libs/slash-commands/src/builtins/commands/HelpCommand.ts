import { EmbedBuilder } from "discord.js"
import { inject } from "inversify"

import { SlashArgError } from "../../errors"
import { SlashCommand } from "../../models"
import { SlashCommandHelpService } from "../../services"
import { command, commandName, validate } from "../decorators"


@command("help", {
    description: `
Get help on commands.
Use the \`commands\` command to list all commands.`})
export class HelpCommand extends SlashCommand {
    @commandName({
        description: "Name of the command.",
    })
    // @arg({
    //     type: "STRING",
    //     description: "Name of the command.",
    //     choices: [
    //         { name: "Help", value: "help" },
    //         { name: "Commands", value: "commands" },
    //         { name: "Ping", value: "ping" },
    //         { name: "UserIs", value: "user-is" },
    //         { name: "Hi", value: "hi" },
    //     ],
    // })
    protected commandName: string

    @inject(SlashCommandHelpService)
    protected helpService: SlashCommandHelpService

    private helpEmbed: EmbedBuilder

    @validate('commandName')
    validateCommandName() {
        this.helpEmbed = this.helpService.getHelpEmbed(this.commandName)

        if (!this.helpEmbed) {
            throw new SlashArgError(`Couldn't find a "${this.commandName}" command. :weary:`)
        }
    }

    async execute() {
        await this.reply("Here's what I've got:", { embeds: [this.helpEmbed] })
    }
}
