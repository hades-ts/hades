import { z } from "zod/v4";

export const discordIdSchema = z
    .string()
    .min(18)
    .max(19)
    .regex(/^[0-9_]+$/);
export const guildIdSchema = discordIdSchema;

export const guildSchema = z.object({
    guildPongMessage: z.string(),
});

export type GuildConfig = z.infer<typeof guildSchema>;

export const configSchema = z.object({
    discordToken: z.string(),
    botOwner: discordIdSchema,
    guilds: z.record(guildIdSchema, guildSchema),
});

export type Config = z.infer<typeof configSchema>;
