import fs from "node:fs";
import path from "node:path";

export type Record<T> = {
    id: string;
    data: T;
};

export abstract class BaseFiletypeStash<T> {
    constructor(
        public readonly path: string,
        public readonly extension: string,
    ) {}

    abstract deserialize(content: string): T;
    abstract serialize(content: T): string;

    findAllSync(): string[] {
        const files = fs.readdirSync(this.path);
        return files.filter((file) => file.endsWith(this.extension));
    }

    index(): string[] {
        return this.findAllSync().map((filepath) =>
            path.basename(filepath, `.${this.extension}`),
        );
    }

    filepathFor(id: string): string {
        const filename = `${id}.${this.extension}`;
        const filepath = path.join(this.path, filename);
        return filepath;
    }

    get(id: string): Record<T> {
        const filepath = this.filepathFor(id);
        const content = fs.readFileSync(filepath, "utf-8");
        return { id, data: this.deserialize(content) };
    }

    set(id: string, content: T) {
        const filepath = this.filepathFor(id);
        const data = this.serialize(content);
        fs.writeFileSync(filepath, data, "utf-8");
    }

    filter(query: (data: T) => boolean): Array<Record<T>> {
        const ids = this.index();
        return ids
            .map((id) => this.get(id))
            .filter((record) => query(record.data));
    }

    delete(id: string) {
        const filepath = this.filepathFor(id);
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
        }
    }
}
