import fs from "node:fs";
import path from "node:path";
import type { z } from "zod";

export type ZodWithId<T extends z.ZodTypeAny> = z.TypeOf<T> & { id: string };

export abstract class BaseFiletypeStash<T extends z.ZodTypeAny> {
    constructor(
        public readonly path: string,
        public readonly extension: string,
        public readonly schema: T,
    ) {}

    abstract deserialize(content: string): z.TypeOf<T>;
    abstract serialize(content: z.TypeOf<T>): string;

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

    get(id: string): ZodWithId<T> {
        const filepath = this.filepathFor(id);
        const content = fs.readFileSync(filepath, "utf-8");
        const data = this.deserialize(content);
        return { ...data, id };
    }

    set(record: ZodWithId<T>) {
        const { id, ...data } = record;
        const filepath = this.filepathFor(id);
        const content = this.serialize(data);
        fs.writeFileSync(filepath, content, "utf-8");
    }

    find(query: (data: z.TypeOf<T>) => boolean): Array<ZodWithId<T>> {
        const ids = this.index();
        return ids.map((id) => this.get(id)).find(query)!;
    }

    filter(query: (data: z.TypeOf<T>) => boolean): Array<ZodWithId<T>> {
        const ids = this.index();
        return ids.map((id) => this.get(id)).filter(query);
    }

    delete(id: string) {
        const filepath = this.filepathFor(id);
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
        }
    }
}
