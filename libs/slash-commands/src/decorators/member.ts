import { Constructable } from "@hades-ts/hades";
import { ApplicationCommandOptionData } from "discord.js";
import { ApplicationCommandOptionTypes } from "discord.js/typings/enums";
import { Optional } from "../utils/types";
import { arg, ArgOptions } from "./arg";


export type MemberArgOptions = Omit<ArgOptions, 'type'>

/**
 * Marks the field of a TextCommand as an argument.
 * @param info Options for the decorator.
 */
export function member(info: MemberArgOptions) {
    return (target: Constructable, key: string) => {
        arg({
            ...info,
            type: ApplicationCommandOptionTypes.USER
        })(target, key);
    };
};