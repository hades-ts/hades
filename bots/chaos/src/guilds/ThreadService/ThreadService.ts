import { guildSingleton } from "@hades-ts/guilds"
import { CommandInteraction, GuildMember, Message } from "discord.js"
import { inject } from "inversify"

import { ThreadFactory } from "./ThreadFactory"
import { ThreadWordAdder } from "./ThreadWordAdder"


@guildSingleton()
export class ThreadService {

    @inject(ThreadFactory)
    private factory!: ThreadFactory

    @inject(ThreadWordAdder)
    protected adder!: ThreadWordAdder

    async validateCreation(memberId: string, channelId: string) {
        return this.factory.validateCreation(memberId, channelId)
    }

    async createThread(member: GuildMember, message: Message) {
        return this.factory.createThread(member, message)
    }

    async addWord(interaction: CommandInteraction, word: string) {
        await this.adder.addWord(interaction, word)
    }

}