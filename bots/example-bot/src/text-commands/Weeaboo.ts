import { EmbedBuilder } from 'discord.js';
import { command, description, TextCommand } from "@hades-ts/text-commands";


@command("weeaboo")
@description("Don't say weeaboo.")
export class WeeabooCommand extends TextCommand {
    async execute() {
        const embed = new EmbedBuilder({
            image: {
                url: "https://i.kym-cdn.com/photos/images/newsfeed/000/029/097/PBF071-Weeaboo.gif",
            },
        })
        return this.reply(
            'Did someone just say "weeaboo"!?', {
            embeds: [embed]
        }
        );
    }
}