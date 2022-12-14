import { inject } from "inversify";

import { HadesClient, singleton } from "@hades-ts/hades";

import { Thread, ThreadMessage } from "../types";
import { PromptService } from "./PromptService";


@singleton(ThreadFormatter)
export class ThreadFormatter {

    @inject(HadesClient)
    protected client: HadesClient;

    @inject(PromptService)
    protected promptService: PromptService;    

    protected formatMessage(message: ThreadMessage) {
        return `${message.authorName}: ${message.content}`
    }

    protected formatMessages(thread: Thread) {
        const messages = thread.messages.map(
            message => this.formatMessage(message)
        )
        return messages.join('\n')
    }

    format(thread: Thread) {
        const formattedTranscript = this.formatMessages(thread);
        const prompt = this.promptService.getPrompt(thread.guildId);
        const botName = this.client.user.username;
        return `${prompt}\n${formattedTranscript}\n${botName}:`
    }    
}