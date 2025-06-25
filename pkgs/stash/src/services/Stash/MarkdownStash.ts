import type { z } from "zod";

import { BaseFiletypeStash } from "./BaseFiletypeStash";
import matter from "gray-matter";
import yaml from "yaml";

export class MarkdownStash<
    T extends z.ZodTypeAny,
> extends BaseFiletypeStash<T> {
    constructor(
        public override readonly path: string,
        public override readonly schema: T,
    ) {
        super(path, "md", schema);
    }

    deserialize(text: string): z.TypeOf<T> {
        const { data, content } = matter(text);
        return this.schema.parse({
            ...data,
            content,
        });
    }

    serialize(record: z.TypeOf<T>) {
        this.schema.parse(record);
        const { content, ...data } = record;
        // matter has no api for saving so we must do it ourselves
        // with yaml serialization
        const yamlData = yaml.stringify(data);
        return `---\n${yamlData}---\n${content}`;
    }
}
