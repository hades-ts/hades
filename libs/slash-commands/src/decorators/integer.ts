import { Constructable } from "@hades-ts/hades";
import { ApplicationCommandOptionTypes } from "discord.js/typings/enums";
import { arg, ArgOptions } from "./arg";


export type IntegerArgOptions = Omit<ArgOptions, 'type'>

/**
 * Marks the field of a TextCommand as an argument.
 * @param info Options for the decorator.
 */
export function integer(info: IntegerArgOptions) {
    return (target: Constructable, key: string) => {
        arg({
            ...info,
            type: ApplicationCommandOptionTypes.INTEGER
        })(target, key);
    };
};