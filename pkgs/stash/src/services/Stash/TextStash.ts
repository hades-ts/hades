import type { z } from "zod";

import { BaseFiletypeStash } from "./BaseFiletypeStash";

export class TextStash<T extends z.ZodTypeAny> extends BaseFiletypeStash<T> {
    constructor(
        public override readonly path: string,
        public override readonly schema: T,
    ) {
        super(path, "txt", schema);
    }

    deserialize(content: string): z.TypeOf<T> {
        return content;
    }

    serialize(content: z.TypeOf<T>): string {
        return content;
    }
}
