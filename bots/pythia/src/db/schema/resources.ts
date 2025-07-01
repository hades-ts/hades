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
        embeddingIndex: index("resource_chunk_embedding_idx").using(
            "hnsw",
            table.vector.op("vector_cosine_ops"),
        ),
    }),
);

export const insertResourceSchema = createInsertSchema(resources);
// export type NewResource = z.infer<typeof insertResourceSchema>;

export type NewResource = {
    resourceId: number;
    guildId: number;
    userId: string;
    title: string;
    length: number;
};

export const insertResourceChunkSchema = createInsertSchema(resourceChunks);
// export type NewResourceChunk = z.infer<typeof insertResourceChunkSchema>;

export type NewResourceChunk = {
    resourceId: number;
    content: string;
    vector: number[];
    startLine: number;
    endLine: number;
};
