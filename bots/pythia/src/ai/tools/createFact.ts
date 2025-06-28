import { inject } from "inversify";
import { z } from "zod/v4";

import { singleton } from "@hades-ts/core";
import { CreateFactAction } from "../../db/actions/facts";

export const CreateFactSchema = z.object({
    guildId: z
        .number()
        .describe("The guild ID where the fact is being created."),
    userId: z.string().describe("The user ID of the user creating the fact."),
    content: z.string().describe("The content of the fact."),
});

export type CreateFactSchema = z.infer<typeof CreateFactSchema>;

@singleton()
export class CreateFactTool {
    @inject(CreateFactAction)
    private createFactAction!: CreateFactAction;

    makeCallback() {
        return ({ guildId, userId, content }: CreateFactSchema) =>
            this.createFactAction.execute(guildId, userId, content);
    }

    $() {
        return {
            name: "createFact",
            description: "Create a new fact in your knowledge-base.",
            parameters: CreateFactSchema,
            execute: this.makeCallback(),
        };
    }
}
