import { z } from "zod"


export const discordIdSchema = z.string().min(18).max(19).regex(/^[0-9_]+$/)

export const periodSchema = z.object({
    seconds: z.number().min(1).max(60).optional(),
    minutes: z.number().min(1).max(60).optional(),
    hours: z.number().min(1).max(24).optional(),
    days: z.number().min(1).max(7).optional(),
}).refine(data => data.seconds !== undefined || data.minutes !== undefined || data.hours !== undefined || data.days !== undefined, {
    message: 'At least one of minutes, hours, or days must be set',
    path: ['minutes', 'hours', 'days'],
})

export type ConfigPeriod = z.infer<typeof periodSchema>

export const channelSchema = z.object({
    id: discordIdSchema,
    guard: z.boolean().optional(),
    singleMessage: z.boolean().optional(),
    period: periodSchema.optional(),
    mentionRole: discordIdSchema.optional(),
    mentionEveryone: z.boolean().optional(),
})

export type ConfigChannel = z.infer<typeof periodSchema>


export const threadSchema = z.object({
    userPeriod: periodSchema.optional(),
    channelPeriod: periodSchema.optional(),
})

export type ConfigThread = z.infer<typeof periodSchema>


export const exemptionsSchema = z.object({
    users: z.array(discordIdSchema).optional(),
    roles: z.array(discordIdSchema).optional(),
})

export type ConfigExemptions = z.infer<typeof periodSchema>


export const guildSchema = z.object({
    disabled: z.boolean().optional(),
    channel: channelSchema.optional(),
    threads: threadSchema.optional(),
    exemptions: exemptionsSchema.optional(),
})

export type ConfigGuild = z.infer<typeof guildSchema>

export const configSchema = z.object({
    discordToken: z.string(),
    botOwner: discordIdSchema,
    dataDirectory: z.string(),
    guilds: z.record(discordIdSchema, guildSchema),
})

export type Config = z.infer<typeof configSchema>