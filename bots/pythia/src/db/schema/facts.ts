import {
    bigint,
    index,
    pgTable,
    serial,
    text,
    varchar,
    vector,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import type { z } from "zod/v4";

export const facts = pgTable(
    "facts",
    {
        id: serial("id").primaryKey(),
        guildId: bigint("guild_id", { mode: "number" }).notNull(),
        userId: varchar("user_id").notNull(),
        content: text("content").notNull(),
        vector: vector("vector", { dimensions: 1536 }).notNull(),
    },
    (table) => ({
        embeddingIndex: index("embedding_idx").using(
            "hnsw",
            table.vector.op("vector_cosine_ops"),
        ),
    }),
);

export const insertFactSchema = createInsertSchema(facts);
export type NewFact = z.infer<typeof insertFactSchema>;
