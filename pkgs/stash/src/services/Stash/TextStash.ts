import { BaseFiletypeStash } from "./BaseFiletypeStash";

export class TextStash extends BaseFiletypeStash<string> {
    constructor(public override readonly path: string) {
        super(path, "txt");
    }

    deserialize(content: string): string {
        return content;
    }

    serialize(content: string): string {
        return content;
    }
}
