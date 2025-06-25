import { guildSingleton } from "@hades-ts/guilds";
import { HadesClient } from "@hades-ts/hades";
import { inject } from "inversify";

import type { Thread, ThreadMessage } from "../types";
import { PromptService } from "./PromptService";

@guildSingleton()
export class ThreadFormatter {
    @inject(HadesClient)
    protected client!: HadesClient;

    @inject(PromptService)
    protected promptService!: PromptService;

    protected formatMessage(message: ThreadMessage) {
        return `${message.authorName}: ${message.content}`;
    }

    protected formatMessages(thread: Thread) {
        const messages = thread.messages.map((message) => this.formatMessage(message));
        return messages.join("\n");
    }

    format(thread: Thread) {
        const formattedTranscript = this.formatMessages(thread);
        const prompt = this.promptService.getPrompt();
        const botName = this.client.user!.username;
        return `${prompt}\n${formattedTranscript}\n${botName}:`;
    }
}
