import { HadesClient } from "@hades-ts/hades"
import { Interaction, Message } from "discord.js"
import { inject, postConstruct } from "inversify"

import { ConfigGuild } from "../../../config"
import { WithRequired } from "../../../types"
import { guildSingleton } from "../../decorators"
import { tokens } from "../../tokens"
import { CleanupBypass } from "./CleanupBypass"


@guildSingleton()
export class MessageFilter {

    @inject(HadesClient)
    protected client!: HadesClient

    @inject(tokens.GuildConfig)
    protected config!: WithRequired<ConfigGuild, 'channel'>

    @inject(tokens.GuildId)
    protected guildId!: string

    @inject(CleanupBypass)
    protected bypass!: CleanupBypass

    protected async onMessageCreate(message: Message) {
        if (!this.config.channel.guard) {
            return
        }

        if (message.guild!.id !== this.guildId) {
            return
        }

        if (message.channel.id !== this.config.channel.id) {
            return
        }

        if (message.author.id === this.client.user!.id) {
            return
        }

        if (this.bypass.isExempt(message.author.id)) {
            return
        }

        try {
            await message.delete()
        } catch (e) {
            console.error(`[MessageManager] Could not delete message ${message.id} in guild ${this.guildId}`)
        }
    }

    protected async onInteractionCreate(interaction: Interaction) {
        if (!this.config.channel.guard) {
            return
        }

        if (interaction.guild!.id !== this.guildId) {
            return
        }

        if (interaction.channelId !== this.config.channel.id) {
            return
        }

        if (interaction.applicationId === this.client.user!.id) {
            return
        }

        if (this.bypass.isExempt(interaction.user.id)) {
            return
        }

        if (!interaction.isCommand()) {
            return
        }

        try {
            await interaction.deleteReply()
        } catch (e) {
            console.error(`[MessageManager] Could not delete interaction ${interaction.id} in guild ${this.guildId}`)
        }
    }

    @postConstruct()
    init() {
        this.client.on('messageCreate', this.onMessageCreate.bind(this))
        this.client.on('interactionCreate', this.onInteractionCreate.bind(this))
    }
}