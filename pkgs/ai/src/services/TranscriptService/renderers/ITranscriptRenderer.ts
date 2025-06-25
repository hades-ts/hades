import type { Transcript } from "../types";

export abstract class ITranscriptRenderer {
    abstract render(transcript: Transcript): string;
}
