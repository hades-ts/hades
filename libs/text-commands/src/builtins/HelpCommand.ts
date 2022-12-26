import { EmbedBuilder } from "discord.js"
import { inject } from "inversify"

import { arg } from "../arguments"
import { TextArgError } from "../arguments/errors/TextArgError"
import { command, description } from "../commands"
import { TextCommand } from "../commands/services/TextCommand"
import { TextCommandHelpService } from "../commands/services/TextCommandHelpService"
import { validate } from "../validation"


@command("help")
@description(`
Get help on commands.
Use the \`commands\` command to list all commands.`)
export class HelpCommand extends TextCommand {
    @arg()
    @description("Name of the command.")
    protected commandName: string

    @inject(TextCommandHelpService)
    protected helpService: TextCommandHelpService

    private helpEmbed: EmbedBuilder

    @validate('commandName')
    validateCommandName() {
        this.helpEmbed = this.helpService.getHelpEmbed(this.commandName)

        if (!this.helpEmbed) {
            throw new TextArgError(`Couldn't find a "${this.commandName}" command. :weary:`)
        }
    }

    execute() {
        return this.reply("Here's what I've got:", { embeds: [this.helpEmbed] })
    }
}
