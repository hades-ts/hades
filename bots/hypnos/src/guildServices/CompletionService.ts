import { OpenAIClient, TokenQuota } from "@hades-ts/ai"
import { guildSingleton } from "@hades-ts/guilds"
import { HadesClient } from "@hades-ts/hades"
import { GuildMember } from "discord.js"
import { inject } from "inversify"

import { Thread } from "../types"
import { QuotaBypassService } from "./QuotaBypassService"
import { RecordService } from "./RecordService"
import { ThreadFormatter } from "./ThreadFormatter"


@guildSingleton()
export class CompletionService {

    @inject(HadesClient)
    protected client!: HadesClient

    @inject(OpenAIClient)
    protected openai!: OpenAIClient

    @inject(ThreadFormatter)
    protected formatter!: ThreadFormatter

    @inject(RecordService)
    protected records!: RecordService

    @inject(TokenQuota)
    protected quota!: TokenQuota

    @inject(QuotaBypassService)
    protected bypass!: QuotaBypassService

    /**
     * Checks if the user is able to send a message.
     * 
     * Throws an error if the user is out of tokens.
     * 
     * @param threadId ID of the thread starter message or undefined if a new thread
     * @param author ID of the user who sent the message
     * @param content Content of the message
     */
    async check(threadId: string | undefined, author: GuildMember, content: string) {
        // add the new message to the thread
        const thread = this.records.getThread(author.guild.id, threadId)
        thread.messages.push({
            authorId: author.id,
            authorName: author.user.username,
            content: content
        })

        // render the thread with the latest message
        const prompt = this.formatter.format(thread)

        // check user has the number of tokens needed to complete the prompt
        if (!this.bypass.isExempted(author)) {
            this.quota.checkTokens(author.id, prompt)
        }

        return thread
    }

    /**
     * Submits a message to the GPT-3 API and returns the updated thread.
     * 
     * @param thread Thread to complete
     * @returns The completed Thread
     */
    async complete(thread: Thread) {
        const lastMessage = thread.messages[thread.messages.length - 1]
        const prompt = this.formatter.format(thread)
        const { completion, tokens } = await this.openai.complete(prompt)

        // get the member based on the thread.guildId and lastMessage.authorId
        const guild = await this.client.guilds.fetch(thread.guildId)
        const member = guild.members.cache.get(lastMessage.authorId)

        if (member && !this.bypass.isExempted(member)) {
            this.quota.spendTokens(member.id, tokens)
        }

        thread.messages.push({
            authorId: this.client.user!.id,
            authorName: this.client.user!.username,
            content: completion
        })

        this.records.saveThread(thread)

        return thread
    }
}