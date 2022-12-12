import { EmbedBuilder } from "discord.js";
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
        let embed = new EmbedBuilder()
        const undocumented: SlashCommandHelper[] = []

        for (const helper of this.helpers.helpers) {
            if (helper.args.size > 0 || helper.description) {
                embed = embed.addFields(
                    {
                        name: helper.getUsage(), 
                        value: helper.description
                    }
                )
            } else {
                undocumented.push(helper)
            }
        }

        embed = embed.addFields(
            {
                name: "Other commands:",
                value: undocumented.map(helper => helper.name).join(", ")
            }
        )

        return embed;
    }
}
