import { inject } from "inversify";
import { z } from "zod/v4";

import { singleton } from "@hades-ts/core";

import { SearchResourcesAction } from "../../db/actions/resources";

export const SearchResourcesSchema = z.object({
    guildId: z.number().describe("The guild ID to search for resources in."),
    query: z.string().describe("The search query."),
    resources: z
        .array(z.number())
        .optional()
        .describe("An optional list of resource IDs to filter by."),
});

export type SearchResourcesSchema = z.infer<typeof SearchResourcesSchema>;

@singleton()
export class SearchResourcesTool {
    @inject(SearchResourcesAction)
    private searchResourcesAction!: SearchResourcesAction;

    makeCallback() {
        return ({ guildId, query, resources }: SearchResourcesSchema) =>
            this.searchResourcesAction.execute(guildId, query, resources);
    }

    $() {
        return {
            name: "searchResources",
            description: "Search for resources in your knowledge-base.",
            parameters: SearchResourcesSchema,
            execute: this.makeCallback(),
        };
    }
}
