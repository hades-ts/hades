import { bypassSchema } from "@hades-ts/bypass"
import { z } from "zod"


export const discordIdSchema = z.string().min(18).max(19).regex(/^[0-9_]+$/)
export const guildIdSchema = discordIdSchema

export const guildSchema = z.object({
    prompt: z.string(),
    quotaEnabled: z.boolean().default(true),
    bypass: bypassSchema.optional().default({
        guildOwner: false,
        users: [],
        roles: [],
    }),
})

export type GuildConfig = z.infer<typeof guildSchema>

export const quotaSchema = z.object({
    quotaFile: z.string(),
    globalDailyTokenLimit: z.number().positive(),
    userDailyTokenLimit: z.number().positive(),
})

export type ConfigQuota = z.infer<typeof quotaSchema>

export const configSchema = z.object({
    discordToken: z.string(),
    botOwner: discordIdSchema,
    gpt3Token: z.string(),
    guilds: z.record(guildIdSchema, guildSchema),
    transcriptsPath: z.string(),
    quota: quotaSchema,
})

export type Config = z.infer<typeof configSchema>