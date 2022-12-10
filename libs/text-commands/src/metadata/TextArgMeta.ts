import { TextArgParser } from "../parsers";
import { Constructor, InstallerFunc, Newable } from "@hades-ts/hades";


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
