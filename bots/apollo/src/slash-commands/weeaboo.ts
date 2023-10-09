import { HadesClient } from "@hades-ts/hades";
import { command, SlashCommand } from "@hades-ts/slash-commands";
import { inject } from "inversify";
import { EmbedBuilder } from "discord.js";

@command("weeaboo", { description: "na cusku zoi weeaboo" })
export class WeeabooCommand extends SlashCommand {
    @inject(HadesClient)
    client: HadesClient;

    async execute() {
        const embed = new EmbedBuilder({
            image: {
                url: "https://i.kym-cdn.com/photos/images/newsfeed/000/029/097/PBF071-Weeaboo.gif",
            },
        });
        this.reply("paunai cusku zoi weeaboo", {
            embeds: [embed],
        });
    }
}
