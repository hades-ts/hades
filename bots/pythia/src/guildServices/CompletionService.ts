import type { GuildMember } from "discord.js";
import { inject } from "inversify";

import { HadesClient } from "@hades-ts/core";
import { guildSingleton } from "@hades-ts/guilds";

// import { OpenAIClient } from "../services/OpenAIClient";
import { QuotaService } from "../services/QuotaService";
import type { Thread } from "../types";
import { QuotaBypassService } from "./QuotaBypassService";
import { RecordService } from "./RecordService";
import { ThreadFormatter } from "./ThreadFormatter";

export class CompletionService {
    @inject(HadesClient)
    protected client!: HadesClient;

    // @inject(OpenAIClient)
    // protected openai!: OpenAIClient;

    @inject(ThreadFormatter)
    protected formatter!: ThreadFormatter;

    @inject(RecordService)
    protected records!: RecordService;

    @inject(QuotaService)
    protected quota!: QuotaService;

    @inject(QuotaBypassService)
    protected bypass!: QuotaBypassService;

    /**
     * Checks if the user is able to send a message.
     *
     * Throws an error if the user is out of tokens.
     *
     * @param threadId ID of the thread starter message or undefined if a new thread
     * @param author ID of the user who sent the message
     * @param content Content of the message
     */
    async check(
        threadId: string | undefined,
        author: GuildMember,
        content: string,
    ) {
        const thread = this.getThread(threadId, author);
        this.addThreadMessage(thread, author, content);

        if (this.isExemptFromQuotaLimits(author)) {
            return thread;
        }

        this.verifyEligibility(author, thread);

        return thread;
    }

    /**
     * Submits a message to the GPT-3 API and returns the updated thread.
     *
     * @param thread Thread to complete
     * @returns The completed Thread
     */
    async complete(thread: Thread) {
        // const lastMessage = thread.messages[thread.messages.length - 1];
        // const prompt = this.formatter.format(thread);
        // const { completion, tokens } = await this.openai.complete(prompt);

        // // get the member based on the thread.guildId and lastMessage.authorId
        // const guild = await this.client.guilds.fetch(thread.guildId);
        // const member = guild.members.cache.get(lastMessage.authorId);

        // if (member && !this.bypass.isExempted(member)) {
        //     this.quota.spendTokens(member.id, tokens);
        // }

        // thread.messages.push({
        //     authorId: this.client.user!.id,
        //     authorName: this.client.user!.username,
        //     content: completion,
        // });

        // this.records.saveThread(thread);

        return thread;
    }

    /**
     * Gets the thread from the records.
     *
     * @param threadId Id of thread
     * @param author Author of thread
     * @returns thread
     */
    protected getThread(
        threadId: string | undefined,
        author: GuildMember,
    ): Thread {
        return this.records.getThread(author.guild.id, threadId);
    }

    /**
     * Adds new message to the specified thread
     *
     * @param thread Thread to add the message to
     * @param author Author of the message
     * @param content Content of the message
     */
    protected addThreadMessage(
        thread: Thread,
        author: GuildMember,
        content: string,
    ): void {
        thread.messages.push({
            authorId: author.id,
            authorName: author.user.username,
            content: content,
        });
    }

    /**
     * Verifies whether the author is exempt from quota limits
     *
     * @param author Author of the thread
     * @returns boolean
     */
    protected isExemptFromQuotaLimits(author: GuildMember): boolean {
        return this.bypass.isExempted(author);
    }

    /**
     * Verifies that the author is eligible to send a message based on quota limits
     *
     * Throws an error if the user is out of tokens.
     *
     * @param author Author of the thread
     * @param thread Thread to verify
     */
    protected verifyEligibility(author: GuildMember, thread: Thread): void {
        const prompt = this.formatter.format(thread);
        this.quota.checkTokens(author.id, prompt);
    }
}
