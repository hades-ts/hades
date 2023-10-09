import { z } from "zod";

export const quotaSchema = z.object({
    quotaFile: z.string(),
    globalDailyTokenLimit: z.number().positive(),
    userDailyTokenLimit: z.number().positive(),
});

export type QuotaConfig = z.infer<typeof quotaSchema>;
