import { z } from "zod/v4";

const discordIdSchema = z
    .string()
    .min(18)
    .max(19)
    .regex(/^[0-9_]+$/);

export const stashChannelsSchema = z.record(discordIdSchema, z.string());

export type StashChannelsSchema = z.infer<typeof stashChannelsSchema>;
