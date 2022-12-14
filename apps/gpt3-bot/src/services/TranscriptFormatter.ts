import { inject } from "inversify";

import { HadesClient, singleton } from "@hades-ts/hades";

import { Transcript, TranscriptMessage } from "../types";
import { PromptService } from "./PromptService";


@singleton(TranscriptFormatter)
export class TranscriptFormatter {

    @inject(HadesClient)
    protected client: HadesClient;

    @inject(PromptService)
    protected promptService: PromptService;    

    protected formatMessage(message: TranscriptMessage) {
        return `${message.authorName}: ${message.content}`
    }

    protected formatMessages(transcript: Transcript) {
        const messages = transcript.messages.map(
            message => this.formatMessage(message)
        )
        return messages.join('\n')
    }

    format(transcript: Transcript) {
        const formattedTranscript = this.formatMessages(transcript);
        const prompt = this.promptService.getPrompt(transcript.guildId);
        const botName = this.client.user.username;
        return `${prompt}\n${formattedTranscript}\n${botName}:`
    }    
}