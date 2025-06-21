import { Constructable } from "@hades-ts/hades";
import { ApplicationCommandOptionType } from "discord.js";

import { arg } from "./arg";
import { SlashCommand } from "../../../models";
import { interfaces } from "inversify";
import { Validator } from "../../../validators";

type TextArgOptions = {
    required?: boolean;
    description: string;
    validators?: Array<interfaces.Newable<Validator<string>> | Validator<string>>;
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
