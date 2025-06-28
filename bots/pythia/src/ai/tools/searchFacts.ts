import { inject } from "inversify";
import { z } from "zod/v4";

import { singleton } from "@hades-ts/core";
import { SearchFactsAction } from "../../db/actions/facts";

export const SearchFactsSchema = z.object({
    guildId: z.number().describe("The guild ID to search for facts in."),
    query: z.string().describe("The search query."),
});

export type SearchFactsSchema = z.infer<typeof SearchFactsSchema>;

@singleton()
export class SearchFactsTool {
    @inject(SearchFactsAction)
    private searchFactsAction!: SearchFactsAction;

    makeCallback() {
        return ({ guildId, query }: SearchFactsSchema) =>
            this.searchFactsAction.execute(guildId, query);
    }

    $() {
        return {
            name: "searchFacts",
            description: "Search for facts in your knowledge-base.",
            parameters: SearchFactsSchema,
            execute: this.makeCallback(),
        };
    }
}
