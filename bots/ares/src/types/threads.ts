export type ThreadMessage = {
    authorId: string
    authorName: string
    content: string
}

export type Thread = {
    guildId: string,
    threadId: undefined | string,
    messages: ThreadMessage[]
}