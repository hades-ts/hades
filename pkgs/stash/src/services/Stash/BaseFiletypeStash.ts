import fs from "fs";
import path from "path";
import type { z } from "zod";

import { ExtensionLocator } from "../Locator/SimpleLocator";

export type ZodWithId<T extends z.ZodTypeAny> = z.TypeOf<T> & { id: string };

export abstract class BaseFiletypeStash<T extends z.ZodTypeAny> {
    locator: ExtensionLocator;

    constructor(
        public readonly path: string,
        public readonly extension: string,
        public readonly schema: T,
    ) {
        this.locator = new ExtensionLocator(path, extension);
    }

    abstract deserialize(content: string): z.TypeOf<T>;
    abstract serialize(content: z.TypeOf<T>): string;

    index(): string[] {
        return this.locator.findAllSync().map((filepath) => path.basename(filepath, `.${this.extension}`));
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
