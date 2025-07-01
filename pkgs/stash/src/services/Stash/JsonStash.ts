import { ParsedFiletypeStash } from "./ParsedFiletypeStash";

export class JsonStash<T> extends ParsedFiletypeStash<T> {
    constructor(path: string, schema: ParsedFiletypeStash<T>["schema"]) {
        super(path, "json", schema);
    }

    deserialize(content: string): T {
        const data = JSON.parse(content);
        return this.schema.parse(data);
    }

    serialize(content: T): string {
        this.schema.parse(content);
        return JSON.stringify(content, null, 4);
    }
}
