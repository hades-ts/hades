import { z } from "zod";
import { BaseFiletypeStash } from "./BaseFiletypeStash";


export class JsonStash<T extends z.ZodTypeAny> extends BaseFiletypeStash<T> {
    constructor(
        public readonly path: string,
        public readonly schema: T,
    ) {
        super(path, "json", schema);
    }

    deserialize(content: string): z.TypeOf<T> {
        const data = JSON.parse(content);
        return this.schema.parse(data);
    }

    serialize(content: z.TypeOf<T>): string {
        this.schema.parse(content);
        return JSON.stringify(content, null, 4);
    }
}