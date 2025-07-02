import { ApplicationCommandOptionType } from "discord.js";
import type { Newable } from "inversify";

import type { SlashCommand } from "../../../models";
import type { Validator } from "../../../validators";
import { arg } from "./arg";

type TextArgOptions = {
    required?: boolean;
    description: string;
    validators?: Array<Newable<Validator<string>> | Validator<string>>;
};

/**
 * Marks the field of a TextCommand as an argument.
 * @param info Options for the decorator.
 */
export function text<T extends SlashCommand>(info: TextArgOptions) {
    return (target: T, key: keyof T & string) => {
        arg<string>({
            type: ApplicationCommandOptionType.String,
            description: info.description,
            required: info.required === undefined ? true : info.required,
            validators: info.validators,
        })(target, key);
    };
}
