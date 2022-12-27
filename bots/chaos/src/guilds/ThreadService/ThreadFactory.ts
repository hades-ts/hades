import { guildSingleton, guildTokens } from "@hades-ts/guilds"
import { GuildMember, Message } from "discord.js"
import { inject } from "inversify"

import { GuildConfig } from "../../config"
import { ThreadDataService } from "./ThreadDataService"
import { ThreadMessageFormatter } from "./ThreadMessageFormatter"
import { ThreadQuotaService } from "./ThreadQuotaService"


@guildSingleton()
export class ThreadFactory {

    @inject(guildTokens.GuildConfig)
    protected config!: GuildConfig

    @inject(ThreadQuotaService)
    protected quota!: ThreadQuotaService

    @inject(ThreadMessageFormatter)
    protected formatter!: ThreadMessageFormatter

    @inject(ThreadDataService)
    protected db!: ThreadDataService

    async validateCreation(memberId: string, channelId: string) {
        if (!this.config.threads) {
            throw new Error("Threads are not enabled for this guild.")
        }

        const threadConfig = this.config.threads!

        const userQuota = await this.quota.userCanSpend(
            memberId,
            threadConfig.userPeriod || { days: 1 },
        )

        if (!userQuota) {
            throw new Error("You need to wait a bit before creating another thread.")
        }

        const channelQuota = await this.quota.channelCanSpend(
            channelId,
            threadConfig.channelPeriod || { days: 1 },
        )

        if (!channelQuota) {
            throw new Error("A thread was already recently created in this channel.")
        }
    }

    async createThread(member: GuildMember, message: Message) {
        const messageContent = await this.formatter.create()
        await this.db.createThread(message.id)
        await this.quota.channelSpend(message.channelId)
        await this.quota.userSpend(member.id)
        return messageContent
    }

}