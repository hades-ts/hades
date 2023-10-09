import { z } from "zod";

export const embedSchema = z.object({
    title: z.string().optional(),
    content: z.string(),
    url: z.string().optional(),
    imageURL: z.string().optional(),
    thumbnailURL: z.string().optional(),
    author: z
        .object({
            name: z.string(),
            url: z.string().optional(),
            iconURL: z.string().optional(),
        })
        .optional(),
    fields: z
        .array(
            z.object({
                name: z.string(),
                value: z.string(),
                inline: z.boolean().optional(),
            }),
        )
        .optional()
        .default([]),
    footer: z
        .object({
            text: z.string(),
            iconURL: z.string().optional(),
        })
        .optional(),
    buttons: z
        .array(
            z.object({
                label: z.string(),
                emoji: z.string().optional(),
                style: z.enum(["PRIMARY", "SECONDARY", "SUCCESS", "DANGER", "LINK"]).optional().default("PRIMARY"),
                url: z.string().optional(),
                customId: z.string(),
            }),
        )
        .optional()
        .default([]),
});

export type EmbedSchema = z.infer<typeof embedSchema>;
