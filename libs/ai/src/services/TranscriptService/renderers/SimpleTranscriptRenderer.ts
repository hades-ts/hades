import { Transcript } from "../types";
import { ITranscriptRenderer } from "./ITranscriptRenderer";

export class SimpleTranscriptRenderer implements ITranscriptRenderer {
    render(transcript: Transcript): string {
        let result = transcript.prompt + "\n";
        for (const entry of transcript.entries) {
            result += `${entry.author}: ${entry.text}\n`;
        }
        return result;
    }
}
