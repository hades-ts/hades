import z from "zod/v4";
import { createResource, CreateResourceAction } from "../../db/actions";
import { tool } from "./tool";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { inject } from "inversify";
import { singleton } from "@hades-ts/core";

export const AddResourceSchema = z.object({
    guildId: z.number().describe("The guild ID of the resource"),
    userId: z.string().describe("The user ID who added the resource"),
    id: z.number().describe("The ID of the resource"),
    title: z.string().describe("The title of the resource"),
    content: z.string().describe("The content of the resource"),
});

export type AddResourceSchema = z.infer<typeof AddResourceSchema>;

@singleton()
export class AddResourceTool {
    @inject(CreateResourceAction)
    private createResourceAction!: CreateResourceAction;

    makeCallback() {
        return ({ guildId, userId, id, title, content }: AddResourceSchema) => {
            return this.createResourceAction.execute(guildId, userId, id, title, content);
        }
    }
    
    $() {
        return {
            name: "addResource",
            description: "Add a resource to your knowledge-base.",
            parameters: AddResourceSchema,
            execute: this.makeCallback(),
        }
    }
}