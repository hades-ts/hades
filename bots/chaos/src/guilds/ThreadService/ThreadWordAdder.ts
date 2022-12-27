import { guildSingleton } from "@hades-ts/guilds"
import { CacheType, ChannelType, CommandInteraction, GuildMember } from "discord.js"
import { inject } from "inversify"

import { GuildConfig } from "../../config"
import { WordAdder } from "../WordAdder"
import { ThreadMessageUpdater } from "./ThreadMessageUpdater"


@guildSingleton()
export class ThreadWordAdder extends WordAdder {

    @inject("wtf")
    protected guildConfig!: GuildConfig

    @inject(ThreadMessageUpdater)
    protected updater!: ThreadMessageUpdater

    protected async validate(interaction: CommandInteraction<CacheType>, word: string): Promise<void> {
        await super.validate(interaction, word)

        if (!this.guildConfig.threads) {
            throw new Error("Sorry, I can't be used here.")
        }
    }

    protected async getStarter(interaction: CommandInteraction) {
        const channel = interaction.channel!

        if (channel.type !== ChannelType.PublicThread) {
            throw new Error("Sorry, I can't be used here.")
        }

        const starter = await channel.fetchStarterMessage()

        if (!starter) {
            throw new Error("Something went wrong. Please try again later.")
        }

        if (starter.author.id !== this.client.user?.id) {
            throw new Error("You can only use this in threads I started.")
        }

        return starter
    }

    async addWord(interaction: CommandInteraction, word: string) {
        await this.validate(interaction, word)
        const starter = await this.getStarter(interaction)
        await this.updater.addWord(starter, interaction.member as GuildMember, word)
    }

}