import { type ApplicationCommandOptionChoiceData, ApplicationCommandOptionType } from "discord.js";

import { arg } from "./arg";
import type { SlashCommand } from "../../../models";

export type IntegerArgOptions = {
    required?: boolean;
    description: string;
    choices?: ApplicationCommandOptionChoiceData[];
    maxValue?: number;
    minValue?: number;
};

/**
 * Marks the field of a TextCommand as an argument.
 * @param info Options for the decorator.
 */
export function integer<T extends SlashCommand>(info: IntegerArgOptions) {
    return (target: T, key: keyof T & string) => {
        arg({
            type: ApplicationCommandOptionType.Integer,
            required: info.required,
            description: info.description,
            choices: info.choices,
            maxValue: info.maxValue,
            minValue: info.minValue,
        })(target, key);
    };
}
