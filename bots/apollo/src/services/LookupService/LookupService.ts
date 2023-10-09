import fs from "fs";
import path from "path";

import { singleton } from "@hades-ts/hades";
import { inject, postConstruct } from "inversify";
import { parse } from "yaml";

export type Factoid = {
    id: string;
    name: string;
    description: string;
    content: string;
};

@singleton(LookupService)
export class LookupService {
    /**
     * This class acts as a factoid lookup service.
     *
     * It reads .md files from `kardaPath` and parses their gray matter.
     *
     * It offers the following methods:
     *
     * - all(): returns all factoids
     * - get(id: string): returns a factoid by name
     *
     * Factoids are stored in the following format:
     * - name: string
     * - description: string
     * - content: string
     */

    @inject(`cfg.kardaPath`)
    kardaPath!: string;

    @postConstruct()
    init() {
        this.checkOrder();
    }

    checkOrder() {
        // if order.json exists, make sure
        // the files actually exist, otherwise throw an error
        const order = this.getOrder();
        if (order === null) {
            return;
        }
        const filenames = fs.readdirSync(this.kardaPath);
        for (const name of order) {
            const filename = `${name}.md`;
            if (!filenames.includes(filename)) {
                throw new Error(`Order file references non-existent file: ${filename}`);
            }
        }
    }

    getOrder() {
        // read kardaPath/order.json, if it exists
        // otherwise return null
        const orderPath = path.join(this.kardaPath, "order.json");
        if (!fs.existsSync(orderPath)) {
            return null;
        }
        const order = fs.readFileSync(orderPath, "utf-8");
        return JSON.parse(order);
    }

    allFilenames(): string[] {
        const order = this.getOrder();
        if (order !== null) {
            return order.map((name) => `${name}.md`);
        }
        const files = fs.readdirSync(this.kardaPath);
        return files.filter((f) => f.endsWith(".md"));
    }

    all(): Factoid[] {
        return this.allFilenames().map((f, i) => this.get(f, i));
    }

    get(filename: string, index?: number): Factoid {
        const file = fs.readFileSync(path.join(this.kardaPath, filename), "utf-8");
        const [matter, content] = file.split("---");
        const { title, description } = parse(matter);
        return {
            id: filename,
            name: `${index !== undefined ? `${index + 1}. ` : ""}${title}`,
            description,
            content,
        };
    }
}
