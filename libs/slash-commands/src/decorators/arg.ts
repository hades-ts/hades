import { inject } from "inversify";

import { getSlashArgMeta } from "../metadata";
import { Constructable, InstallerFunc, Newable } from "@hades-ts/hades";
import { camelToDash } from "../utils";
import { ApplicationCommandOptionData } from "discord.js";
import { Optional } from "../utils/types";

export type ArgOptions = Optional<ApplicationCommandOptionData, 'name'>;

/**
 * Marks the field of a TextCommand as an argument.
 * @param info Options for the decorator.
 */
export function arg(info: ArgOptions) {
    return (target: Constructable, key: string) => {
        const meta = getSlashArgMeta(target.constructor, key);
        meta.name = camelToDash(key);
        meta.options = {
            required: true,
            ...info,
            name: info.name || meta.name,
        } as ApplicationCommandOptionData;
        // get design:type from the constructor
        const typeInfo = Reflect.getMetadata("design:type", target, key).name;
        meta.type = typeInfo
        meta.property = key;
        // decorate the field with @inject(key)
        inject(key)(target, key);
    };
};


