import { guildSingleton } from "@hades-ts/guilds"
import { CacheType, CommandInteraction, GuildMember } from "discord.js"
import { inject } from "inversify"

import { GuildConfig } from "../../config"
import { WordAdder } from "../WordAdder"
import { MessageUpdater } from "./MessageUpdater"


@guildSingleton()
export class ChannelWordAdder extends WordAdder {

    @inject("wtf")
    protected guildConfig!: GuildConfig

    @inject(MessageUpdater)
    private updater!: MessageUpdater

    protected async validate(interaction: CommandInteraction<CacheType>, word: string): Promise<void> {
        await super.validate(interaction, word)

        if (!this.guildConfig.channel) {
            throw new Error("Sorry, I can't be used here.")
        }

        if (this.guildConfig.channel.id !== interaction.channelId) {
            const channelId = this.guildConfig.channel.id
            throw new Error(
                `You can only use this in the <#${channelId}> channel or in threads started with \`/create\`.`
            )
        }
    }

    async addWord(interaction: CommandInteraction, word: string) {
        await this.validate(interaction, word)
        await this.updater.addWord(interaction.member as GuildMember, word)
    }
}
