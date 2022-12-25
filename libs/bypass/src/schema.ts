import { z } from "zod";

export const bypassSchema = z.object({
    guildOwner: z.boolean().default(false),
    users: z.array(z.string()).default([]),
    roles: z.array(z.string()).default([]),
});

export type BypassConfig = z.infer<typeof bypassSchema>;