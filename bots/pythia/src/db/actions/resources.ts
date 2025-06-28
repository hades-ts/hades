import { generateEmbeddings } from "../ai/embedding";
import { db } from "../client";
import { embeddings as embeddingsTable } from "../db/schema/embeddings";
import {
    insertResourceSchema,
    type NewResourceParams,
    resources,
} from "../schema/resources";

export const createResource = async (input: NewResourceParams) => {
    try {
        const { content } = insertResourceSchema.parse(input);

        const [_resource] = await db
            .insert(resources)
            .values({ content })
            .returning();

        const embeddings = await generateEmbeddings(content);
        await db.insert(embeddingsTable).values(
            embeddings.map((embedding: number[]) => ({
                resourceId: _resource.id,
                ...embedding,
            })),
        );

        return "Resource successfully created and embedded.";
    } catch (e) {
        if (e instanceof Error)
            return e.message.length > 0
                ? e.message
                : "Error, please try again.";
    }
};
