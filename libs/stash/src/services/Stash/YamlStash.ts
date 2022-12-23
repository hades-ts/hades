import { z } from "zod";
import { BaseFiletypeStash } from "./BaseStash";
import { stringify, parse } from "yaml";


export class YamlStash<T extends z.ZodTypeAny> extends BaseFiletypeStash<T> {

    constructor(
        public readonly path: string,
        public readonly schema: T,
    ) {
        super(path, "yaml", schema);
    }

    deserialize(content: string): z.TypeOf<T> {
        const data = parse(content);
        return this.schema.parse(data);
    }

    serialize(content: z.TypeOf<T>): string {
        this.schema.parse(content);
        return stringify(content);
    }
}