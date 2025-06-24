import { singleton } from "@hades-ts/hades";
import { EmbedBuilder } from "discord.js";
import { inject } from "inversify";

import { TextCommandHelper } from "./TextCommandHelper";
import { TextCommandHelperRegistry } from "./TextCommandHelperRegistry";

@singleton(TextCommandHelpService)
export class TextCommandHelpService {
    @inject(TextCommandHelperRegistry)
    protected helpers: TextCommandHelperRegistry;

    getHelpEmbed(command: string) {
        const helper = this.helpers.helperFor(command);

        if (helper) {
            return helper.getHelpEmbed();
        }
    }

    getCommandsEmbed() {
        let embed = new EmbedBuilder();
        const undocumented: TextCommandHelper[] = [];

        for (const helper of this.helpers.helpers) {
            if (helper.args.size > 0 || helper.description) {
                embed = embed.addFields({
                    name: helper.getUsage(),
                    value: helper.description,
                });
            } else {
                undocumented.push(helper);
            }
        }

        embed = embed.addFields({
            name: "Other commands:",
            value: undocumented.map((helper) => helper.name).join(", "),
        });

        return embed;
    }
}
