import { GuildMember } from "discord.js";
import { inject } from "inversify";

import { HadesClient, singleton } from "@hades-ts/hades";

import { AuthzService } from "./AuthzService";
import { OpenAIClient } from "./OpenAIClient";
import { QuotaService } from "./QuotaService";
import { RecordService } from "./RecordService";
import { TranscriptFormatter } from "./TranscriptFormatter";


@singleton(CompletionService)
export class CompletionService {

    @inject(HadesClient)
    protected client: HadesClient;

    @inject(AuthzService)
    protected authz: AuthzService;

    @inject(OpenAIClient)
    protected openai: OpenAIClient;

    @inject(RecordService)
    protected records: RecordService;

    @inject(TranscriptFormatter)
    protected formatter: TranscriptFormatter;

    @inject(QuotaService)
    quota: QuotaService    

    async check(threadId: string | undefined, author: GuildMember, content: string) {
        // throws if the user is not authorized
        if (this.authz.checkAccess(author)) {
            // returns true if the user is the bot author
            return
        } // returns undefined if the user is authorized

        const thread = this.records.getThread(author.guild.id, threadId);

        thread.messages.push({
            authorId: author.id,
            authorName: author.user.username,
            content: content
        })

        const prompt = this.formatter.format(thread);
        this.quota.checkTokens(author.id, prompt);
    }

    async submit(threadId: string | undefined, author: GuildMember, content: string) {
        const thread = this.records.getThread(author.guild.id, threadId);

        thread.messages.push({
            authorId: author.id,
            authorName: author.user.username,
            content: content
        })

        const prompt = this.formatter.format(thread);
        const completion = await this.openai.complete(author.id, prompt);

        thread.messages.push({
            authorId: this.client.user.id,
            authorName: this.client.user.username,
            content: completion
        })

        this.records.saveThread(thread);
        return thread;
    }
}