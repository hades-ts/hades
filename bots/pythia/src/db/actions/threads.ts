import { eq } from "drizzle-orm";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { inject } from "inversify";

import { singleton } from "@hades-ts/core";

import { generateEmbedding } from "../../ai/embeddings";
import {
    insertThreadMessageSchema,
    insertThreadSchema,
    type NewThread,
    type NewThreadMessage,
    threadMessages,
    threads,
} from "../schema";
import { vectorize } from "../utils";

export const createThread = async (
    db: PostgresJsDatabase,
    guildId: number,
    channelId: number,
    threadId: number,
    isPrivate: boolean,
) => {
    const thread: NewThread = {
        guildId,
        channelId,
        threadId,
        private: isPrivate,
    };
    insertThreadSchema.parse(thread);
    return db.insert(threads).values(thread).returning();
};

@singleton()
export class CreateThreadAction {
    @inject(PostgresJsDatabase)
    private db!: PostgresJsDatabase;

    async execute(
        guildId: number,
        channelId: number,
        threadId: number,
        isPrivate: boolean,
    ) {
        return createThread(this.db, guildId, channelId, threadId, isPrivate);
    }
}

export const createThreadMessage = async (
    db: PostgresJsDatabase,
    threadId: number,
    userId: number,
    content: string,
) => {
    const embedding = await generateEmbedding(content);
    const message: NewThreadMessage = {
        threadId,
        userId,
        content,
        vector: embedding,
    };
    insertThreadMessageSchema.parse(message);
    return db.insert(threadMessages).values(message).returning();
};

@singleton()
export class CreateThreadMessageAction {
    @inject(PostgresJsDatabase)
    private db!: PostgresJsDatabase;

    async execute(threadId: number, userId: number, content: string) {
        return createThreadMessage(this.db, threadId, userId, content);
    }
}

export const searchThreads = async (
    db: PostgresJsDatabase,
    guildId: number,
    query: string,
) => {
    const queryEmbedding = await generateEmbedding(query);

    const results = await db
        .select({
            thread: threads,
            message: threadMessages,
            similarity: vectorize(threadMessages.vector, queryEmbedding),
        })
        .from(threadMessages)
        .innerJoin(threads, eq(threadMessages.threadId, threads.threadId))
        .where(eq(threads.guildId, guildId))
        .orderBy((t) => t.similarity)
        .limit(20);

    return results.reduce(
        (acc, { thread, message }) => {
            if (!acc[thread.threadId]) {
                acc[thread.threadId] = {
                    ...thread,
                    messages: [],
                };
            }
            acc[thread.threadId].messages.push(message);
            return acc;
        },
        {} as Record<
            number,
            typeof threads.$inferSelect & {
                messages: (typeof threadMessages.$inferSelect)[];
            }
        >,
    );
};

@singleton()
export class SearchThreadsAction {
    @inject(PostgresJsDatabase)
    private db!: PostgresJsDatabase;

    async execute(guildId: number, query: string) {
        return searchThreads(this.db, guildId, query);
    }
}

export const searchThread = async (
    db: PostgresJsDatabase,
    threadId: number,
    query: string,
) => {
    const queryEmbedding = await generateEmbedding(query);

    return db
        .select({
            message: threadMessages,
            similarity: vectorize(threadMessages.vector, queryEmbedding),
        })
        .from(threadMessages)
        .where(eq(threadMessages.threadId, threadId))
        .orderBy((t) => t.similarity)
        .limit(10);
};

@singleton()
export class SearchThreadAction {
    @inject(PostgresJsDatabase)
    private db!: PostgresJsDatabase;

    async execute(threadId: number, query: string) {
        return searchThread(this.db, threadId, query);
    }
}
