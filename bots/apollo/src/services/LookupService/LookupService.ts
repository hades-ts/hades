import fs from "fs";
import path from "path";

import { singleton } from "@hades-ts/hades";
import { inject } from "inversify";
import { parse } from 'yaml'


export type Factoid = {
    id: string;
    name: string;
    description: string;
    content: string;
}

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

    allFilenames(): string[] {
        const files = fs.readdirSync(this.kardaPath);
        return files.filter((f) => f.endsWith(".md"));
    }

    all(): Factoid[] {
        return this.allFilenames().map((f) => this.get(f));
    }

    get(filename: string): Factoid {
        const file = fs.readFileSync(path.join(this.kardaPath, filename), "utf-8");
        const [matter, content] = file.split("---");
        const { title, description } = parse(matter);
        return {
            id: filename,
            name: title,
            description,
            content,
        }
    }

}