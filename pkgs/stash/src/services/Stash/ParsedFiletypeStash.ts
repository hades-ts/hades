import type { z } from "zod/v4";
import { BaseFiletypeStash } from "./BaseFiletypeStash";

export abstract class ParsedFiletypeStash<T> extends BaseFiletypeStash<T> {
    constructor(
        path: string,
        extension: string,
        public readonly schema: z.ZodType<T>,
    ) {
        super(path, extension);
    }
}
