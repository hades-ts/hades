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

import { ConfigGuild } from "../config"
import { GuildManager } from "../guilds"


@command("add-word", { description: "Add a word to a multiplayer message." })
export class AddWordCommand extends SlashCommand {

    @arg({ description: "Your word.", type: ApplicationCommandOptionType.String })
    protected word!: string

    @inject('cfg.guilds')
    protected configGuilds!: Record<string, ConfigGuild>

    @inject(HadesClient)
    protected client!: HadesClient

    @inject(GuildManager)
    protected guildManager!: GuildManager

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
        const guild = await this.guildManager.getGuild(this.interaction.guildId!)

        try {
            if (this.interaction.channel?.type === ChannelType.PublicThread) {
                await guild.threading.addWord(this.interaction, this.word)
            } else {
                await guild.channel.addWord(this.interaction, this.word)
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