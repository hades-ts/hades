import { z } from "zod";

export const discordIdSchema = z.string().min(18).max(19).regex(/^[0-9_]+$/);

export const guildSchema = z.object({
    channel: discordIdSchema,
    hour: z.number().min(0).max(23),
})

export type ConfigGuild = z.infer<typeof guildSchema>

export const configSchema = z.object({
    discordToken: z.string(),
    botOwner: discordIdSchema,
    dataDirectory: z.string(),
    guilds: z.record(discordIdSchema, guildSchema),
})

export type Config = z.infer<typeof configSchema>