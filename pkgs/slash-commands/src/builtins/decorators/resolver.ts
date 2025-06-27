import type { Constructable } from "@hades-ts/core";

import { getSlashArgMeta } from "../../metadata";

export interface IResolver {
    getChoices(): Array<{ name: string; value: string }>;
}

/**
 * Marks the field of a TextCommand as an argument.
 * @param info Options for the decorator.
 */
export function resolver(resolver: any) {
    return (target: Constructable, key: string) => {
        const meta = getSlashArgMeta(target.constructor, key);
        meta.choicesResolver = resolver as any;
    };
}
