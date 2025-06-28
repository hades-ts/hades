import { eq } from "drizzle-orm";
import { generateEmbedding } from "../../ai/embeddings";
import { facts, insertFactSchema, type NewFact } from "../schema";
import { vectorize } from "../utils";
import { singleton } from "@hades-ts/core";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { inject } from "inversify";

export const createFact = async (
    db: PostgresJsDatabase,
    guildId: number,
    userId: string,
    content: string,
) => {
    const embedding = await generateEmbedding(content);
    const fact: NewFact = {
        guildId,
        userId,
        content,
        vector: embedding,
    };
    insertFactSchema.parse(fact);
    return db.insert(facts).values(fact).returning();
};

@singleton()
export class CreateFactAction {
    @inject(PostgresJsDatabase)
    private db!: PostgresJsDatabase;

    async execute(guildId: number, userId: string, content: string) {
        return createFact(this.db, guildId, userId, content);
    }
}

export const searchFacts = async (db: PostgresJsDatabase, guildId: number, query: string) => {
    const queryEmbedding = await generateEmbedding(query);

    const results = await db
        .select({
            fact: facts,
            similarity: vectorize(facts.vector, queryEmbedding),
        })
        .from(facts)
        .where(eq(facts.guildId, guildId))
        .orderBy((t) => t.similarity)
        .limit(10);

    return results;
};

@singleton()
export class SearchFactsAction {
    @inject(PostgresJsDatabase)
    private db!: PostgresJsDatabase;

    async execute(guildId: number, query: string) {
        return searchFacts(this.db, guildId, query);
    }
}

export const deleteFact = async (db: PostgresJsDatabase, factId: number) => {
    return db.delete(facts).where(eq(facts.id, factId));
};

@singleton()
export class DeleteFactAction {
    @inject(PostgresJsDatabase)
    private db!: PostgresJsDatabase;

    async execute(factId: number) {
        return deleteFact(this.db, factId);
    }
}