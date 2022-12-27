import { guildSingleton, guildTokens } from '@hades-ts/guilds'
import { GuildMember, Message } from 'discord.js'
import fs from 'fs'
import { inject, postConstruct } from "inversify"
import { DateTime } from 'luxon'
import path from 'path'
import { z } from 'zod'


const threadSchema = z.object({
    created: z.string().datetime(),
    text: z.string(),
    users: z.array(z.object({
        id: z.string(),
        name: z.string(),
        word: z.string(),
    })),
})

export type ThreadData = z.infer<typeof threadSchema>


@guildSingleton()
export class ThreadDataService {

    @inject('cfg.dataDirectory')
    protected dataDirectory!: string

    @inject(guildTokens.GuildId)
    protected guildId!: string

    @postConstruct()
    protected init() {
        this.ensureDataDirectory()
    }

    protected get guildDirectory() {
        return path.join(this.dataDirectory, this.guildId)
    }

    protected getThreadFile(threadId: string) {
        return path.join(this.guildDirectory, `${threadId}.json`)
    }

    protected ensureDataDirectory() {
        if (!fs.existsSync(this.dataDirectory)) {
            fs.mkdirSync(this.dataDirectory, { recursive: true })
        }
    }

    protected ensureGuildDirectory() {
        if (!fs.existsSync(this.guildDirectory)) {
            fs.mkdirSync(this.guildDirectory, { recursive: true })
        }
    }

    protected threadFileExists(threadId: string) {
        const threadFile = this.getThreadFile(threadId)
        return fs.existsSync(threadFile)
    }

    protected getThreadData(threadId: string): ThreadData {
        this.ensureGuildDirectory()

        if (!this.threadFileExists(threadId)) {
            return {
                created: DateTime.now().toUTC().toISO(),
                text: '',
                users: [],
            }
        }

        const threadFile = this.getThreadFile(threadId)
        const data = fs.readFileSync(threadFile, 'utf-8')
        return threadSchema.parse(JSON.parse(data))
    }

    protected saveData(threadId: string, data: ThreadData) {
        this.ensureGuildDirectory()
        const threadFile = this.getThreadFile(threadId)
        fs.writeFileSync(threadFile, JSON.stringify(data, null, 4))
    }

    createThread(threadId: string) {
        const data = this.getThreadData(threadId)
        this.saveData(threadId, data)
    }

    userAlreadyPosted(threadId: string, userId: string) {
        const data = this.getThreadData(threadId)
        return data.users.some(user => user.id === userId)
    }

    addWord(thread: Message, member: GuildMember, word: string) {
        const data = this.getThreadData(thread.id)

        const words = data.text.split(' ')
        const lastWord = words[words.length - 1]

        if (lastWord.toLocaleLowerCase() === word.toLocaleLowerCase()) {
            throw new Error(`That's the same word as the last one!`)
        }

        data.text = data.text + ' ' + word
        data.users.push({
            id: member.id,
            name: member.displayName,
            word,
        })
        this.saveData(thread.id, data)
        return data.text
    }

}