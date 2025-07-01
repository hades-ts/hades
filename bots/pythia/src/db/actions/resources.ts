import { singleton } from "@hades-ts/core";
import { and, eq, inArray } from "drizzle-orm";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { inject } from "inversify";
import { generateEmbedding, generateEmbeddings } from "../../ai/embeddings";
import {
    insertResourceChunkSchema,
    insertResourceSchema,
    type NewResource,
    resourceChunks,
    resources,
} from "../schema";
import { vectorize } from "../utils";

export const createResource = async (
    db: PostgresJsDatabase,
    guildId: number,
    userId: string,
    id: number,
    title: string,
    content: string,
) => {
    const resource: NewResource = {
        resourceId: id,
        guildId,
        userId,
        title,
        length: content.length,
    };
    insertResourceSchema.parse(resource);

    const [_resource] = await db.insert(resources).values(resource).returning();

    const embeddings = await generateEmbeddings(content);
    const chunks = embeddings.map((e) => ({
        resourceId: _resource.id,
        content: e.content,
        vector: e.embedding,
        startLine: 0,
        endLine: 0,
    }));
    insertResourceChunkSchema.parse(chunks[0]); // cheap validation
    await db.insert(resourceChunks).values(chunks);

    return _resource;
};

@singleton()
export class CreateResourceAction {
    @inject(PostgresJsDatabase)
    private db!: PostgresJsDatabase;

    async execute(
        guildId: number,
        userId: string,
        id: number,
        title: string,
        content: string,
    ) {
        return createResource(this.db, guildId, userId, id, title, content);
    }
}

export const searchResources = async (
    db: PostgresJsDatabase,
    guildId: number,
    query: string,
    resourceIds?: number[],
) => {
    const queryEmbedding = await generateEmbedding(query);

    const results = await db
        .select({
            resource: resources,
            chunk: resourceChunks,
            similarity: vectorize(resourceChunks.vector, queryEmbedding),
        })
        .from(resourceChunks)
        .innerJoin(resources, eq(resourceChunks.resourceId, resources.id))
        .where(
            and(
                eq(resources.guildId, guildId),
                resourceIds
                    ? inArray(resourceChunks.resourceId, resourceIds)
                    : undefined,
            ),
        )
        .orderBy((t) => t.similarity)
        .limit(10);

    return results.reduce(
        (acc, { resource, chunk }) => {
            if (!acc[resource.id]) {
                acc[resource.id] = {
                    ...resource,
                    chunks: [],
                };
            }
            acc[resource.id].chunks.push(chunk);
            return acc;
        },
        {} as Record<
            number,
            typeof resources.$inferSelect & {
                chunks: (typeof resourceChunks.$inferSelect)[];
            }
        >,
    );
};

@singleton()
export class SearchResourcesAction {
    @inject(PostgresJsDatabase)
    private db!: PostgresJsDatabase;

    async execute(guildId: number, query: string, resourceIds?: number[]) {
        return searchResources(this.db, guildId, query, resourceIds);
    }
}

export const searchResource = async (
    db: PostgresJsDatabase,
    resourceId: number,
    query: string,
) => {
    const queryEmbedding = await generateEmbedding(query);

    return db
        .select({
            chunk: resourceChunks,
            similarity: vectorize(resourceChunks.vector, queryEmbedding),
        })
        .from(resourceChunks)
        .where(eq(resourceChunks.resourceId, resourceId))
        .orderBy((t) => t.similarity)
        .limit(10);
};

@singleton()
export class SearchResourceAction {
    @inject(PostgresJsDatabase)
    private db!: PostgresJsDatabase;

    async execute(resourceId: number, query: string) {
        return searchResource(this.db, resourceId, query);
    }
}

export const deleteResource = async (
    db: PostgresJsDatabase,
    resourceId: number,
) => {
    return db.delete(resources).where(eq(resources.id, resourceId));
};

@singleton()
export class DeleteResourceAction {
    @inject(PostgresJsDatabase)
    private db!: PostgresJsDatabase;

    async execute(resourceId: number) {
        return deleteResource(this.db, resourceId);
    }
}
