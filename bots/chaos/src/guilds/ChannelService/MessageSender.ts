import { guildSingleton, guildTokens } from "@hades-ts/guilds"
import { HadesClient } from "@hades-ts/hades"
import { TextChannel } from "discord.js"
import { inject } from "inversify"
import { DateTime } from "luxon"

import { GuildConfig } from "../../config"
import { WithRequired } from "../../types"
import { ChannelCleaner } from "./ChannelCleaner"
import { DataService } from "./DataService"
import { ChannelMessageFormatter } from "./MessageFormatter"


@guildSingleton()
export class MessageSender {

    @inject(HadesClient)
    private client!: HadesClient

    @inject("wtf")
    private config!: WithRequired<GuildConfig, 'channel'>

    @inject(ChannelMessageFormatter)
    private formatter!: ChannelMessageFormatter

    @inject(guildTokens.GuildId)
    private guildId!: string

    @inject(DataService)
    private dataService!: DataService

    @inject(ChannelCleaner)
    private channelCleaner!: ChannelCleaner

    protected async sendNewMessage() {
        console.log(`[ChannelManager] Sending new message for guild ${this.guildId}`)
        const channel = await this.client.channels.fetch(this.config.channel.id) as TextChannel
        const messageContent = await this.formatter.create()
        const message = await channel.send(messageContent)
        return message
    }

    protected createData(threadId: string, created: DateTime) {
        return {
            thread: threadId,
            created: created.toISO(),
            text: '',
            users: [],
        }
    }

    protected saveNewData(threadId: string, datetime?: DateTime) {
        console.log(`[ChannelManager] Saving data for guild ${this.guildId}`)
        const created = (datetime || DateTime.now()).toUTC()
        const data = this.createData(threadId, created)
        this.dataService.saveData(data)
    }

    async createMessage(datetime?: DateTime) {
        const message = await this.sendNewMessage()
        this.saveNewData(message.id, datetime)
        await this.channelCleaner.cleanup()
    }

}