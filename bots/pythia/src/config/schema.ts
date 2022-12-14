import { z } from "zod";

export const discordIdSchema = z.string().min(18).max(19).regex(/^[0-9_]+$/);
export const guildIdSchema = discordIdSchema

export const quotaExemptionsSchema = z.object({
    users: z.array(discordIdSchema).optional(),
    roles: z.array(discordIdSchema).optional(),
}).refine(data => data.users === undefined && data.roles === undefined, {
    message: 'At least one of users or roles must be defined',
    path: ['users', 'roles']
})

export type ConfigQuotaExemptions = z.infer<typeof quotaExemptionsSchema>

export const guildSchema = z.object({
    prompt: z.string(),
    quotaExemptions: quotaExemptionsSchema.optional(),
    quotaEnabled: z.boolean().optional().default(true),
})

export type ConfigGuild = z.infer<typeof guildSchema>

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