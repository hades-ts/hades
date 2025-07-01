import { parse, stringify } from "yaml";
import type { z } from "zod";

import { BaseFiletypeStash } from "./BaseFiletypeStash";
import { ParsedFiletypeStash } from "./ParsedFiletypeStash";

export class YamlStash<T> extends ParsedFiletypeStash<T> {
    constructor(
        public override readonly path: string,
        public override readonly schema: ParsedFiletypeStash<T>["schema"],
    ) {
        super(path, "yaml", schema);
    }

    deserialize(content: string): T {
        const data = parse(content);
        return this.schema.parse(data);
    }

    serialize(content: T): string {
        this.schema.parse(content);
        return stringify(content);
    }
}
