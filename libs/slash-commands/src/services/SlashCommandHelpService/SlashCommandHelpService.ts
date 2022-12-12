import { MessageEmbed } from "discord.js";
import { inject } from "inversify";
import { singleton } from "@hades-ts/hades";

import { SlashCommandHelperRegistry } from "./SlashCommandHelperRegistry";
import { SlashCommandHelper } from "./SlashCommandHelper";



@singleton(SlashCommandHelpService)
export class SlashCommandHelpService {

    @inject(SlashCommandHelperRegistry)
    helpers: SlashCommandHelperRegistry

    getHelpEmbed(command: string) {
        const helper = this.helpers.helperFor(command)

        if (helper) {
            return helper.getHelpEmbed()
        }
    }

    getCommandsEmbed() {
        let embed = new MessageEmbed()
        const undocumented: SlashCommandHelper[] = []

        for (const helper of this.helpers.helpers) {
            if (helper.args.size > 0 || helper.description) {
                embed = embed.addField(helper.getUsage(), helper.description)
            } else {
                undocumented.push(helper)
            }
        }

        embed = embed.addField(
            "Other commands:",
            undocumented.map(helper => helper.name).join(", ")
        )

        return embed;
    }
}
