import { inject } from "inversify";
import { z } from "zod/v4";

import { singleton } from "@hades-ts/core";

import { SearchThreadAction } from "../../db/actions/threads";

export const SearchThreadSchema = z.object({
    threadId: z.number().describe("The ID of the thread to search within."),
    query: z.string().describe("The search query."),
});

export type SearchThreadSchema = z.infer<typeof SearchThreadSchema>;

@singleton()
export class SearchThreadTool {
    @inject(SearchThreadAction)
    private searchThreadAction!: SearchThreadAction;

    makeCallback() {
        return ({ threadId, query }: SearchThreadSchema) =>
            this.searchThreadAction.execute(threadId, query);
    }

    $() {
        return {
            name: "searchThread",
            description: "Search within a specific conversation thread.",
            parameters: SearchThreadSchema,
            execute: this.makeCallback(),
        };
    }
}
