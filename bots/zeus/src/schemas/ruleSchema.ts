import { z } from "zod";

export const ruleSchema = z.object({
    title: z.string(),
    description: z.string(),
    content: z.string(),
});

export type RuleRecord = z.infer<typeof ruleSchema>;
