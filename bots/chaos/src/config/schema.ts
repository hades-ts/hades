import { z } from "zod";

export const discordIdSchema = z.string().min(18).max(19).regex(/^[0-9_]+$/);

export const periodSchema = z.object({
    seconds: z.number().min(1).max(60).optional(),
    minutes: z.number().min(1).max(60).optional(),
    hours: z.number().min(1).max(24).optional(),
    days: z.number().min(1).max(7).optional(),
}).refine(data => data.seconds !== undefined || data.minutes !== undefined || data.hours !== undefined || data.days !== undefined, {
    message: 'At least one of minutes, hours, or days must be set',
    path: ['minutes', 'hours', 'days'],
})

export const guildSchema = z.object({
    disabled: z.boolean().optional(),
    channel: discordIdSchema,
    period: periodSchema.optional(),
    guardChannel: z.boolean().optional(),
    singleMessage: z.boolean().optional(),
    exemptedUsers: z.array(discordIdSchema).optional(),
    exemptedRoles: z.array(discordIdSchema).optional(),
    mentionRole: discordIdSchema.optional(),
    mentionEveryone: z.boolean().optional(),
})

export type ConfigGuild = z.infer<typeof guildSchema>

export const configSchema = z.object({
    discordToken: z.string(),
    botOwner: discordIdSchema,
    dataDirectory: z.string(),
    guilds: z.record(discordIdSchema, guildSchema),
})

export type Config = z.infer<typeof configSchema>