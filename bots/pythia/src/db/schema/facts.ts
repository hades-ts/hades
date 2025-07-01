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

export const facts = pgTable(
    "facts",
    {
        id: serial("id").primaryKey(),
        guildId: varchar("guild_id").notNull(),
        userId: varchar("user_id").notNull(),
        content: text("content").notNull(),
        vector: vector("vector", { dimensions: 1536 }).notNull(),
    },
    (table) => ({
        embeddingIndex: index("factsembedding_idx").using(
            "hnsw",
            table.vector.op("vector_cosine_ops"),
        ),
    }),
);

export const insertFactSchema = createInsertSchema(facts);
// export type NewFact = z.infer<typeof insertFactSchema>;

export type NewFact = {
    guildId: string;
    userId: string;
    content: string;
    vector: number[];
};
