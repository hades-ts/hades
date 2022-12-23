import { z } from "zod";

export const roleSchema = z.object({
    roleId: z.string(),
    description: z.string(),
    content: z.string(),
});

export type RoleRecord = z.infer<typeof roleSchema>;
