
export type ConfigGuild = {
    users?: string[]
    roles?: string[]
    prompt: string
}

export type ConfigGuilds = Record<string, ConfigGuild>

export type ConfigQuota = {
    quotaFile: string,
    globalDailyTokenLimit: number,
    userDailyTokenLimit: number
}