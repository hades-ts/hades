import { Constructable } from "@hades-ts/hades";
import { ApplicationCommandOptionTypes } from "discord.js/typings/enums";
import { arg, ArgOptions } from "./arg";


export type BooleanArgOptions = Omit<ArgOptions, 'type'>

/**
 * Marks the field of a TextCommand as an argument.
 * @param info Options for the decorator.
 */
export function boolean(info: BooleanArgOptions) {
    return (target: Constructable, key: string) => {
        arg({
            ...info,
            type: ApplicationCommandOptionTypes.BOOLEAN
        })(target, key);
    };
};