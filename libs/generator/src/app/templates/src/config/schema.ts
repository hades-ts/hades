import { z } from "zod";

export const discordIdSchema = z
    .string()
    .min(18)
    .max(19)
    .regex(/^[0-9_]+$/);
export const guildIdSchema = discordIdSchema;

export const configSchema = z.object({
    discordToken: z.string(),
    botOwner: discordIdSchema,
});

export type Config = z.infer<typeof configSchema>;
