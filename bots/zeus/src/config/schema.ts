import { z } from "zod"


export const discordIdSchema = z.string().min(18).max(19).regex(/^[0-9_]+$/)

export const guildSchema = z.object({
    disabled: z.boolean().optional(),
    rolesChannel: discordIdSchema.optional(),
    stashChannels: z.record(discordIdSchema, z.string()).optional().default({}),
})

export type GuildConfig = z.infer<typeof guildSchema>

export const configSchema = z.object({
    discordToken: z.string(),
    botOwner: discordIdSchema,
    dataPath: z.string(),
    guilds: z.record(discordIdSchema, guildSchema),
})

export type Config = z.infer<typeof configSchema>

export const roleSchema = z.object({
    roleId: discordIdSchema,
    description: z.string(),
    title: z.string(),
})

export type RoleConfig = z.infer<typeof roleSchema>

export const ruleSchema = z.object({
    title: z.string(),
    description: z.string(),
    content: z.string(),
})

export type RuleConfig = z.infer<typeof ruleSchema>