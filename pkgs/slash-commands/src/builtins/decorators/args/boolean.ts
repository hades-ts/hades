import { ApplicationCommandOptionType } from "discord.js";
import type { Newable } from "inversify";
import type { SlashCommand } from "../../../models";
import type { Validator } from "../../../validators";
import { arg } from "./arg";

type BooleanArgOptions = {
    required?: boolean;
    description: string;
    validators?: Array<Newable<Validator<boolean>>>;
};

/**
 * Marks the field of a TextCommand as an argument.
 * @param info Options for the decorator.
 */
export function boolean<T extends SlashCommand>(info: BooleanArgOptions) {
    return (target: T, key: keyof T & string) => {
        arg<boolean>({
            type: ApplicationCommandOptionType.Boolean,
            description: info.description,
            required: info.required,
            validators: info.validators,
        })(target, key);
    };
}
