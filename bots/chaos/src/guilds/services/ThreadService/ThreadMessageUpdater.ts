import { GuildMember, Message } from "discord.js"
import { inject } from "inversify"

import { guildSingleton } from "../../decorators"
import { ThreadDataService } from "./ThreadDataService"
import { ThreadMessageFormatter } from "./ThreadMessageFormatter"
import { ThreadWordValidator } from "./WordValidator"


@guildSingleton()
export class ThreadMessageUpdater {

    @inject(ThreadMessageFormatter)
    private formatter!: ThreadMessageFormatter

    @inject(ThreadWordValidator)
    private validator!: ThreadWordValidator

    @inject(ThreadDataService)
    private dataService!: ThreadDataService


    async addWord(thread: Message, member: GuildMember, word: string) {
        if (this.dataService.userAlreadyPosted(thread.id, member.id)) {
            throw new Error('You already posted in this thread!')
        }

        this.validator.validateWord(member, word)

        const text = this.dataService.addWord(thread, member, word)
        const updatedContent = this.formatter.update(thread, text)
        await thread.edit(updatedContent)
    }

}