import { EmbedBuilder, Message, MessageCreateOptions } from "discord.js";
import { inject } from "inversify";
import { ConfigGuild } from "../../config";
import { guildSingleton } from "../decorators";
import { tokens } from "../tokens";

@guildSingleton()
export class MessageFormatter {

    @inject(tokens.GuildConfig)
    private config!: ConfigGuild;

    create(): MessageCreateOptions {
        let mention = undefined;

        if (this.config.mentionEveryone) {
            mention = `@everyone `;
        } else if (this.config.mentionRole) {
            mention = `<@&${this.config.mentionRole}> `;
        }

        return {
            content: mention,
            embeds: [
                new EmbedBuilder()
                    .setTitle(`New chaos message:`)
                    .setDescription(`No words yet!`)
                    .setFooter({
                        text: 'Add a word with /chaos <word>',
                    })
            ]
        };
    }

    update(message: Message, text: string): MessageCreateOptions {
        const embed = message.embeds[0];

        return {
            embeds: [
                new EmbedBuilder(embed.data)
                    .setDescription(`\`\`\`\n${text}\n\`\`\``)
            ]
        }
    }
}
    