import { inject } from "inversify";
import { MessageEmbed } from "discord.js";

import { arg, command, commandName, validate } from "../decorators"
import { SlashCommand } from "../../models";
import { SlashArgError } from "../../errors";
import { SlashCommandHelpService } from "../../services";


@command("help", { description: `
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
    commandName: string;

    @inject(SlashCommandHelpService)
    helpService: SlashCommandHelpService;

    private helpEmbed: MessageEmbed;

    @validate('commandName')
    validateCommandName() {
        this.helpEmbed = this.helpService.getHelpEmbed(this.commandName);

        if (!this.helpEmbed) {
            throw new SlashArgError(`Couldn't find a "${this.commandName}" command. :weary:`);
        }
    }

    execute() {
        return this.reply("Here's what I've got:", { embeds: [this.helpEmbed] });
    }
}
