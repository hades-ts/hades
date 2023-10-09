import { Constructor, InstallerFunc, Newable } from "@hades-ts/hades";

import { TextArgParser } from "../../../parsing";

/**
 * Decorator metadata for command arguments.
 */
export class TextArgMeta {
    name?: string;
    type?: Constructor;
    property?: string;
    description?: string;
    parserType?: Newable<TextArgParser>;
    validatorMethods = new Set<string>();
    validatorInstallers: InstallerFunc[] = [];
}
