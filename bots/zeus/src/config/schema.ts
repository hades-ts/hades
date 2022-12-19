import { z } from "zod";

export const discordIdSchema = z.string().min(18).max(19).regex(/^[0-9_]+$/);

export const guildSchema = z.object({
    disabled: z.boolean().optional(),
    rules: z.array(z.object({
        name: z.string(),
        description: z.string(),
    })).nonempty(),
})

export type ConfigGuild = z.infer<typeof guildSchema>

export const configSchema = z.object({
    discordToken: z.string(),
    botOwner: discordIdSchema,
    dataDirectory: z.string(),
    guilds: z.record(discordIdSchema, guildSchema),
})

export type Config = z.infer<typeof configSchema>