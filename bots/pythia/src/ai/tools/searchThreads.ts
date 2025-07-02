import { inject } from "inversify";
import { z } from "zod/v4";

import { singleton } from "@hades-ts/core";

import { SearchThreadsAction } from "../../db/actions/threads";

export const SearchThreadsSchema = z.object({
    guildId: z.number().describe("The guild ID to search for threads in."),
    query: z.string().describe("The search query."),
});

export type SearchThreadsSchema = z.infer<typeof SearchThreadsSchema>;

@singleton()
export class SearchThreadsTool {
    @inject(SearchThreadsAction)
    private searchThreadsAction!: SearchThreadsAction;

    makeCallback() {
        return ({ guildId, query }: SearchThreadsSchema) =>
            this.searchThreadsAction.execute(guildId, query);
    }

    $() {
        return {
            name: "searchThreads",
            description: "Search through conversation threads.",
            parameters: SearchThreadsSchema,
            execute: this.makeCallback(),
        };
    }
}
