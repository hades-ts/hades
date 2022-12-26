import { inject } from "inversify"
import { DateTime } from "luxon"

import { ConfigGuild } from "../../../config"
import { WithRequired } from "../../../types"
import { guildSingleton } from "../../decorators"
import { tokens } from "../../tokens"
import { MessageSender } from "./MessageSender"
import { RolloverService } from "./RolloverService"


@guildSingleton()
export class MessageScheduler {

    @inject(tokens.GuildId)
    private guildId!: string

    @inject(tokens.GuildConfig)
    private config!: WithRequired<ConfigGuild, 'channel'>

    @inject(MessageSender)
    private sender!: MessageSender

    @inject(RolloverService)
    private rolloverService!: RolloverService

    protected schedule(dateTime: DateTime, callback: () => void) {
        const now = DateTime.local()
        const delay = dateTime.diff(now).as('milliseconds')
        setTimeout(callback, delay)
    }

    protected async createMessage(datetime?: DateTime) {
        await this.sender.createMessage(datetime)
        this.scheduleNextMessage()
    }

    async checkRollover() {
        const rolloverStatus = await this.rolloverService.checkRollover()
        switch (rolloverStatus.type) {
            case 'empty':
                await this.createMessage()
                break
            case 'passed':
                await this.createMessage(rolloverStatus.changeOver)
                break
            case 'scheduled':
                this.schedule(rolloverStatus.changeOver.plus({
                    seconds: 10,
                }), () => this.checkRollover())
                break
        }
    }

    scheduleNextMessage(datetime?: DateTime) {
        console.log(`[ChannelManager] Scheduling next message for guild ${this.guildId}`)
        const period = this.config.channel.period || { days: 1 }
        const basis = datetime || DateTime.now()
        this.schedule(basis.toUTC().plus(period), () => this.checkRollover())
    }

}