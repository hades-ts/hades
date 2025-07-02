import { tool } from "ai";
import { inject } from "inversify";
import { z } from "zod";

import { service, singleton } from "@hades-ts/core";

import { CreateFactAction } from "../../db/actions/facts";

export const CreateFactSchema = z.object({
    guildId: z
        .string()
        .describe("The guild ID where the fact is being created."),
    userId: z.string().describe("The user ID of the user creating the fact."),
    content: z.string().describe("The content of the fact."),
});

export type CreateFactSchema = z.infer<typeof CreateFactSchema>;

@service()
export class CreateFactTool {
    @inject(CreateFactAction)
    private createFactAction!: CreateFactAction;

    makeCallback() {
        return ({ guildId, userId, content }: CreateFactSchema) =>
            this.createFactAction.execute(guildId, userId, content);
    }

    get $() {
        return tool({
            description: `
Create a new fact in your knowledge-base. 
Priority: High
Your ONLY way to remember.`,
            parameters: CreateFactSchema,
            execute: this.makeCallback(),
        });
    }
}
