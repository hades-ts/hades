import fs from "fs";
import path from "path";

import { ISerializer, JsonSerializer } from "./serializers";

export class RecordDbError extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
    }
}

export class NoSuchRecordError extends RecordDbError {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
    }
}

export class RecordDb<T extends { id: string }> {
    // eslint-disable-next-line no-useless-constructor
    constructor(
        protected rootPath: string,
        protected factory: (id: string) => T,
        protected extension: string = "json",
        protected serializer: ISerializer = new JsonSerializer(),
    ) {}

    protected ensureRootPath() {
        if (!fs.existsSync(this.rootPath)) {
            fs.mkdirSync(this.rootPath, { recursive: true });
        }
    }

    protected getFilename(id: string) {
        return path.join(this.rootPath, `${id}.${this.extension}`);
    }

    exists(id: string) {
        const filename = this.getFilename(id);
        return fs.existsSync(filename);
    }

    create(id: string) {
        return this.factory(id);
    }

    get(id: string): T {
        const filename = this.getFilename(id);

        if (!fs.existsSync(filename)) {
            throw new NoSuchRecordError(`No such record: ${id}`);
        }

        const text = fs.readFileSync(filename, "utf-8");
        const data = this.serializer.deserialize(text);
        return data as T;
    }

    save(data: T) {
        this.ensureRootPath();
        const filename = this.getFilename(data.id);
        const text = this.serializer.serialize(data);
        fs.writeFileSync(filename, text, "utf-8");
    }

    delete(id: string) {
        const filename = this.getFilename(id);
        if (!fs.existsSync(filename)) {
            throw new NoSuchRecordError(`No such record: ${id}`);
        }
        fs.unlinkSync(filename);
    }
}
