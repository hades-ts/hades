import {
    bigint,
    index,
    integer,
    pgTable,
    serial,
    text,
    varchar,
    vector,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import type { z } from "zod/v4";

export const resources = pgTable("resources", {
    id: serial("id").primaryKey(),
    resourceId: integer("resource_id").notNull(),
    guildId: bigint("guild_id", { mode: "number" }).notNull(),
    userId: varchar("user_id").notNull(),
    title: text("title").notNull(),
    length: integer("length").notNull(),
});

export const resourceChunks = pgTable(
    "resource_chunks",
    {
        id: serial("id").primaryKey(),
        resourceId: integer("resource_id")
            .notNull()
            .references(() => resources.id, { onDelete: "cascade" }),
        content: text("content").notNull(),
        vector: vector("vector", { dimensions: 1536 }).notNull(),
        startLine: integer("start_line").notNull(),
        endLine: integer("end_line").notNull(),
    },
    (table) => ({
        embeddingIndex: index("embedding_idx").using(
            "hnsw",
            table.vector.op("vector_cosine_ops"),
        ),
    }),
);

export const insertResourceSchema = createInsertSchema(resources);
export type NewResource = z.infer<typeof insertResourceSchema>;

export const insertResourceChunkSchema = createInsertSchema(resourceChunks);
export type NewResourceChunk = z.infer<typeof insertResourceChunkSchema>;
