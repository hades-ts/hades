import { ApplicationCommandOptionType } from "discord.js";

import { arg } from "./arg";
import { UserParser } from "../../parsers";
import type { SlashCommand } from "../../../models";

export type UserArgOptions = {
    required?: boolean;
    description: string;
};

/**
 * Marks the field of a TextCommand as an argument.
 * @param info Options for the decorator.
 */
export function user<T extends SlashCommand>(info: UserArgOptions) {
    return (target: T, key: keyof T & string) => {
        arg({
            type: ApplicationCommandOptionType.User,
            required: info.required,
            description: info.description,
            parser: new UserParser()
        })(target, key);
    };
}
