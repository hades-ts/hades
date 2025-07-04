import type { ApplicationCommandOptionChoiceData } from "discord.js";

import type { Constructable } from "@hades-ts/core";

import { getSlashArgMeta } from "../../metadata";

export interface ICompleter {
    complete(value: string): Promise<ApplicationCommandOptionChoiceData[]>;
}

/**
 * Marks the field of a TextCommand as an argument.
 * @param info Options for the decorator.
 */
export function completer(completer: any) {
    return (target: Constructable, key: string) => {
        const meta = getSlashArgMeta(target.constructor, key);
        meta.choicesCompleter = completer as any;
    };
}
