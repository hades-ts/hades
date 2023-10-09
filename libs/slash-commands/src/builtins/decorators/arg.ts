import { Constructable } from "@hades-ts/hades";
import {
    ApplicationCommandAutocompleteStringOption,
    ApplicationCommandChannelOptionData,
    ApplicationCommandChoicesData,
    ApplicationCommandNonOptionsData,
    ApplicationCommandNumericOptionData,
    ApplicationCommandOptionData,
    ApplicationCommandStringOptionData,
    ApplicationCommandSubCommandData,
    ApplicationCommandSubGroupData,
} from "discord.js";
import { inject } from "inversify";

import { getSlashArgMeta } from "../../metadata";
import { SlashCommand } from "../../models";
import { camelToDash, Optional } from "../../utils";

export type ArgOptions =
    | Optional<ApplicationCommandSubGroupData, "name">
    | Optional<ApplicationCommandNonOptionsData, "name">
    | Optional<ApplicationCommandChannelOptionData, "name">
    | Optional<ApplicationCommandChoicesData, "name">
    | Optional<ApplicationCommandAutocompleteStringOption, "name">
    | Optional<ApplicationCommandNumericOptionData, "name">
    | Optional<ApplicationCommandStringOptionData, "name">
    | Optional<ApplicationCommandSubCommandData, "name">;

export const makeArgMeta = (info: ArgOptions, target: Constructable, key: string) => {
    const meta = getSlashArgMeta(target.constructor, key);
    meta.name = camelToDash(key);
    meta.options = {
        required: true,
        ...info,
        name: info.name || meta.name,
    } as ApplicationCommandOptionData;
    // get design:type from the constructor
    const typeInfo = Reflect.getMetadata("design:type", target, key).name;
    meta.type = typeInfo;
    meta.property = key;
    return meta;
};

/**
 * Marks the field of a TextCommand as an argument.
 * @param info Options for the decorator.
 */
export function arg<T extends SlashCommand>(info: ArgOptions) {
    return (target: Constructable<T>, key: string) => {
        makeArgMeta(info, target, key);
        // decorate the field with @inject(key)
        inject(key)(target, key);
    };
}
