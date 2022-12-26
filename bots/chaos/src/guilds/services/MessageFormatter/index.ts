import { EmbedBuilder, Message, MessageCreateOptions } from "discord.js"
import { injectable } from "inversify"



@injectable()
export abstract class BaseMessageFormatter {

    protected async createTitle() {
        return `New multiplayer message:`
    }

    protected async createDescription() {
        return `No words yet!`
    }

    protected async createFooter() {
        return `Add a word with /add-word <word>`
    }

    protected async createEmbed(): Promise<EmbedBuilder> {
        const title = await this.createTitle()
        const description = await this.createDescription()
        const footer = await this.createFooter()
        return new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setFooter({
                text: footer,
            })
    }

    protected async createContent(): Promise<undefined | string> {
        return undefined
    }

    async create(): Promise<MessageCreateOptions> {
        return {
            content: await this.createContent(),
            embeds: [
                await this.createEmbed()
            ]
        }
    }

    update(message: Message, text: string): MessageCreateOptions {
        const embed = message.embeds[0]

        return {
            embeds: [
                new EmbedBuilder(embed.data)
                    .setDescription(`\`\`\`\n${text}\n\`\`\``)
            ]
        }
    }
}
