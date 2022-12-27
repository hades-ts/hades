
export type Entry = {
    author: string,
    text: string,
}

export type Transcript = {
    id: string,
    prompt: string,
    entries: Entry[],
}