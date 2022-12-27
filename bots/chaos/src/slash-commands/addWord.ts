import { HadesClient } from "@hades-ts/hades"
import {
    arg,
    command,
    SlashArgError,
    SlashCommand,
    validate
} from "@hades-ts/slash-commands"
import { ApplicationCommandOptionType, ChannelType } from "discord.js"
import { inject } from "inversify"

import { GuildConfig } from "../config"
import { GuildServiceFactory } from "../services"


@command("add-word", { description: "Add a word to a multiplayer message." })
export class AddWordCommand extends SlashCommand {

    @arg({ description: "Your word.", type: ApplicationCommandOptionType.String })
    protected word!: string

    @inject('cfg.guilds')
    protected configGuilds!: Record<string, GuildConfig>

    @inject(HadesClient)
    protected client!: HadesClient

    @inject(GuildServiceFactory)
    protected guildServiceFactory!: GuildServiceFactory

    @validate("word")
    protected validateWord() {
        if (this.word.split(/\s+/).length > 1) {
            throw new SlashArgError("Please only use one word.")
        }
    }

    protected async reject(content: string) {
        try {
            await this.interaction.deferReply({
                ephemeral: true,
            })
            await this.interaction.editReply({
                content,
            })
        } catch (error) {
            console.error(`Couldn't reply to user:`, error)
        }
    }

    async execute(): Promise<void> {
        const guildService = await this.guildServiceFactory.getGuildService(this.interaction.guild!)

        try {
            if (this.interaction.channel?.type === ChannelType.PublicThread) {
                await guildService.threading.addWord(this.interaction, this.word)
            } else {
                await guildService.channel.addWord(this.interaction, this.word)
            }
            await this.interaction.reply({
                content: "Word added!",
                ephemeral: true,
            })
        } catch (error) {
            if (error instanceof Error) {
                await this.reject(error.message)
            } else {
                await this.reject("Sorry, something went wrong. Try again later!")
            }
        }
    }

}