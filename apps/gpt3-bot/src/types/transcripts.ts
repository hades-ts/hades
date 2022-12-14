export type TranscriptMessage = {
    authorId: string
    authorName: string
    content: string
}

export type Transcript = {
    guildId: string,
    threadId: undefined | string,
    messages: TranscriptMessage[]
}