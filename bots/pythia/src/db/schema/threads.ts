import {
    bigint,
    boolean,
    index,
    pgTable,
    primaryKey,
    serial,
    text,
    vector,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import type { z } from "zod/v4";

export const threads = pgTable(
    "threads",
    {
        guildId: bigint("guild_id", { mode: "number" }).notNull(),
        channelId: bigint("channel_id", { mode: "number" }).notNull(),
        threadId: bigint("thread_id", { mode: "number" }).notNull(),
        private: boolean("private").notNull(),
    },
    (table) => ({
        pk: primaryKey({ columns: [table.threadId] }),
    }),
);

export const threadMessages = pgTable(
    "thread_messages",
    {
        id: serial("thread_message_pk").primaryKey(),
        threadId: bigint("thread_id", { mode: "number" })
            .notNull()
            .references(() => threads.threadId, { onDelete: "cascade" }),
        userId: bigint("user_id", { mode: "number" }).notNull(),
        content: text("content").notNull(),
        vector: vector("vector", { dimensions: 1536 }).notNull(),
    },
    (table) => ({
        embeddingIndex: index("thread_message_embedding_idx").using(
            "hnsw",
            table.vector.op("vector_cosine_ops"),
        ),
    }),
);

export const insertThreadSchema = createInsertSchema(threads);
// export type NewThread = z.infer<typeof insertThreadSchema>;
export type NewThread = {
    guildId: number;
    channelId: number;
    threadId: number;
    private: boolean;
};

export const insertThreadMessageSchema = createInsertSchema(threadMessages);
// export type NewThreadMessage = z.infer<typeof insertThreadMessageSchema>;
export type NewThreadMessage = {
    threadId: number;
    userId: number;
    content: string;
    vector: number[];
};
