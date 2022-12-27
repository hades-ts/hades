import { RecordDb } from "../RecordDb"
import { ITranscriptRenderer } from "./renderers/ITranscriptRenderer"
import { Transcript } from "./types"


export class TranscriptError extends Error { }

export class NoSuchTranscriptError extends TranscriptError { }

export class TranscriptService {

    // eslint-disable-next-line no-useless-constructor
    constructor(
        protected recordDb: RecordDb<Transcript>,
        protected renderer: ITranscriptRenderer,
    ) { }

    exists(id: string) {
        return this.recordDb.exists(id)
    }

    create(id: string, prompt: string) {
        const record = this.recordDb.create(id)
        record.prompt = prompt
        return record
    }

    get(id: string) {
        return this.recordDb.get(id)
    }

    save(data: Transcript) {
        this.recordDb.save(data)
    }

    delete(id: string) {
        this.recordDb.delete(id)
    }

    render(id: string) {
        const transcript = this.recordDb.get(id)
        if (!transcript) {
            throw new NoSuchTranscriptError(`No such transcript: ${id}`)
        }
        return this.renderer.render(transcript)
    }

}