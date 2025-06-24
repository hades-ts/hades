import fs from "fs";
import { DateTime } from "luxon";
import path from "path";
import { z } from "zod";

export const tagSchema = z.object({
    tag: z.string(),
    expiry: z.string().datetime().optional(),
});

export type TagData = z.infer<typeof tagSchema>;

export const recordSchema = z.array(tagSchema).default([]);

export type RecordData = z.infer<typeof recordSchema>;

export class TagDb {
    // eslint-disable-next-line no-useless-constructor
    constructor(protected dataRoot: string) {}

    protected ensureDataRoot() {
        if (!fs.existsSync(this.dataRoot)) {
            fs.mkdirSync(this.dataRoot, { recursive: true });
        }
    }

    protected getFilename(id: string) {
        return path.join(this.dataRoot, `${id}.json`);
    }

    exists(id: string) {
        this.ensureDataRoot();

        const filename = this.getFilename(id);
        return fs.existsSync(filename);
    }

    getTags(id: string) {
        this.ensureDataRoot();

        if (!this.exists(id)) {
            return [] as TagData[];
        }

        const filename = this.getFilename(id);
        const text = fs.readFileSync(filename, "utf-8");
        return recordSchema.parse(JSON.parse(text));
    }

    saveTags(id: string, tags: TagData[]) {
        this.ensureDataRoot();
        const filename = this.getFilename(id);
        const data = recordSchema.parse(tags);
        fs.writeFileSync(filename, JSON.stringify(data, null, 2), "utf-8");
    }

    addTag(id: string, tag: string, expiry?: DateTime) {
        this.ensureDataRoot();
        const tags = this.getTags(id);
        const existingTag = tags.find((t) => t.tag === tag);
        const iso = expiry?.toISO();

        if (existingTag) {
            if (expiry && existingTag.expiry) {
                const existingExpiry = DateTime.fromISO(existingTag.expiry ?? "");
                if (existingExpiry < expiry) {
                    existingTag.expiry = expiry.toISO();
                    this.saveTags(id, tags);
                }
            }
        } else {
            tags.push({ tag, expiry: iso });
            this.saveTags(id, tags);
        }
    }

    removeTag(id: string, tag: string) {
        this.ensureDataRoot();
        const tags = this.getTags(id);
        const newTags = tags.filter((t) => t.tag !== tag);
        const filename = this.getFilename(id);
        fs.writeFileSync(filename, JSON.stringify(newTags, null, 2), "utf-8");
    }

    getTag(id: string, tag: string) {
        const tags = this.getTags(id);
        return tags.find((t) => t.tag === tag);
    }
}
