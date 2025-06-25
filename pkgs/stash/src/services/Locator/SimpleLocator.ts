import fs from "fs";
import { injectable } from "inversify";

import type { Locator } from "./Locator";

@injectable()
export class ExtensionLocator implements Locator {
    // eslint-disable-next-line no-useless-constructor
    constructor(
        public readonly path: string,
        public readonly extension: string,
    ) {}

    findAllSync(): string[] {
        const files = fs.readdirSync(this.path);
        return files.filter((file) => file.endsWith(this.extension));
    }
}
