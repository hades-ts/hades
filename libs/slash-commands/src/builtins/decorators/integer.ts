import { Constructable } from "@hades-ts/hades"
import { ApplicationCommandOptionChoiceData, ApplicationCommandOptionType } from "discord.js"

import { arg } from "./arg"


export type IntegerArgOptions = {
    required?: boolean;
    description: string;
    choices?: ApplicationCommandOptionChoiceData[];
}

/**
 * Marks the field of a TextCommand as an argument.
 * @param info Options for the decorator.
 */
export function integer(info: IntegerArgOptions) {
    return (target: Constructable, key: string) => {
        arg({
            type: ApplicationCommandOptionType.Integer,
            required: info.required,
            description: info.description,
            choices: info.choices,
        })(target, key)
    }
}