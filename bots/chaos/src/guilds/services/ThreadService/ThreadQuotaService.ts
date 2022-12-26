import fs from 'fs'
import { inject, postConstruct } from "inversify"
import { DateTime } from 'luxon'
import path from 'path'
import { z } from 'zod'

import { ConfigPeriod } from '../../../config'
import { guildSingleton } from "../../decorators"
import { tokens } from "../../tokens"


const usersQuotaSchema = z.record(
    z.string(),
    z.string().datetime(),
)

const channelsQuotaSchema = z.record(
    z.string(),
    z.string().datetime(),
)

const threadQuotaSchema = z.object({
    users: usersQuotaSchema,
    channels: channelsQuotaSchema,
})

export type ThreadQuotaData = z.infer<typeof threadQuotaSchema>

@guildSingleton()
export class ThreadQuotaService {

    @inject('cfg.dataDirectory')
    protected dataDirectory!: string

    @inject(tokens.GuildId)
    protected guildId!: string

    @postConstruct()
    protected init() {
        this.ensureDataDirectory()
    }

    protected get guildDirectory() {
        return path.join(this.dataDirectory, this.guildId)
    }

    protected get guildFile() {
        return path.join(this.guildDirectory, 'quota.json')
    }

    protected ensureDataDirectory() {
        if (!fs.existsSync(this.dataDirectory)) {
            fs.mkdirSync(this.dataDirectory, { recursive: true })
        }
    }

    protected dataFileExists() {
        return fs.existsSync(this.guildFile)
    }

    protected getData(): ThreadQuotaData {
        this.ensureDataDirectory()

        if (!this.dataFileExists()) {
            return {
                users: {},
                channels: {},
            }
        }

        const data = fs.readFileSync(this.guildFile, 'utf-8')
        return threadQuotaSchema.parse(JSON.parse(data))
    }

    protected saveData(data: Partial<ThreadQuotaData>) {
        const oldData = this.getData()
        const newData = {
            users: {
                ...oldData.users,
                ...data.users,
            },
            channels: {
                ...oldData.channels,
                ...data.channels,
            }
        }
        this.ensureDataDirectory()
        fs.writeFileSync(this.guildFile, JSON.stringify(newData, null, 4))
        return newData
    }

    protected getUsers() {
        return this.getData().users
    }

    protected getUser(userId: string) {
        const users = this.getUsers()
        return users[userId]
    }

    protected getChannels() {
        return this.getData().channels
    }

    protected getChannel(channelId: string) {
        const channels = this.getChannels()
        return channels[channelId]
    }

    public userCanSpend(userId: string, period: ConfigPeriod) {
        const userTimestamp = this.getUser(userId)
        if (!userTimestamp) {
            return true
        }
        const userDateTime = DateTime.fromISO(userTimestamp).plus(period)
        const now = DateTime.now().toUTC()
        return userDateTime < now
    }

    public channelCanSpend(channelId: string, period: ConfigPeriod) {
        const channelTimestamp = this.getChannel(channelId)
        if (!channelTimestamp) {
            return true
        }
        const channelDateTime = DateTime.fromISO(channelTimestamp).plus(period)
        const now = DateTime.now().toUTC()
        return channelDateTime < now
    }

    public userSpend(userId: string) {
        const timestamp = DateTime.now().toUTC().toISO()
        this.saveData({
            users: { [userId]: timestamp }
        })
    }

    public channelSpend(channelId: string) {
        const timestamp = DateTime.now().toUTC().toISO()
        this.saveData({
            channels: { [channelId]: timestamp }
        })
    }

}