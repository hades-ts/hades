import matter from "gray-matter";
import yaml from "yaml";
import z from "zod/v4";

import { BaseFiletypeStash } from "./BaseFiletypeStash";
import { ParsedFiletypeStash } from "./ParsedFiletypeStash";

export type MarkdownStashData<T> = {
    data: T;
    content: string;
};

export class MarkdownStash<T> extends BaseFiletypeStash<MarkdownStashData<T>> {
    schema: z.ZodType<MarkdownStashData<T>>;

    constructor(path: string, schema: z.ZodType<T>) {
        super(path, "md");
        this.schema = z.object({
            data: schema,
            content: z.string(),
        });
    }

    deserialize(text: string): MarkdownStashData<T> {
        const { data, content } = matter(text);
        return this.schema.parse({
            ...data,
            content,
        });
    }

    serialize(record: MarkdownStashData<T>) {
        this.schema.parse(record);
        const { content, ...data } = record;
        // matter has no api for saving so we must do it ourselves
        // with yaml serialization
        const yamlData = yaml.stringify(data);
        return `---\n${yamlData}---\n${content}`;
    }
}
