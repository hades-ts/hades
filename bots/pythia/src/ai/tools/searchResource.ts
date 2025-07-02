import { inject } from "inversify";
import { z } from "zod/v4";

import { singleton } from "@hades-ts/core";

import { SearchResourceAction } from "../../db/actions/resources";

export const SearchResourceSchema = z.object({
    resourceId: z.number().describe("The ID of the resource to search within."),
    query: z.string().describe("The search query."),
});

export type SearchResourceSchema = z.infer<typeof SearchResourceSchema>;

@singleton()
export class SearchResourceTool {
    @inject(SearchResourceAction)
    private searchResourceAction!: SearchResourceAction;

    makeCallback() {
        return ({ resourceId, query }: SearchResourceSchema) =>
            this.searchResourceAction.execute(resourceId, query);
    }

    $() {
        return {
            name: "searchResource",
            description:
                "Search within a specific resource in your knowledge-base.",
            parameters: SearchResourceSchema,
            execute: this.makeCallback(),
        };
    }
}
