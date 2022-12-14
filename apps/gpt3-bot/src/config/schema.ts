import { z } from "zod";

export const discordIdSchema = z.string().min(18).max(19).regex(/^[0-9_]+$/);
export const userIdSchema = discordIdSchema
export const roleIdSchema = discordIdSchema
export const guildIdSchema = discordIdSchema

export const guildSchema = z.object({
    prompt: z.string(),
    users: z.array(userIdSchema).nonempty().optional(),
    roles: z.array(roleIdSchema).nonempty().optional(),
})

export const quotaSchema = z.object({
    quotaFile: z.string(),
    globalDailyTokenLimit: z.number().positive(),
    userDailyTokenLimit: z.number().positive(),
})

export const configSchema = z.object({
    discordToken: z.string(),
    botOwner: userIdSchema,
    gpt3Token: z.string(),
    guilds: z.record(guildIdSchema, guildSchema),
    transcriptsPath: z.string(),
    quota: quotaSchema,
})

