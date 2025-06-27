import { Constructable } from "@hades-ts/core";
import { ApplicationCommandOptionType } from "discord.js";
import type { SlashCommand } from "../../../models";
import { RoleParser } from "../../parsers";
import { arg } from "./arg";

export type RoleArgOptions = {
    required?: boolean;
    description: string;
};

/**
 * Marks the field of a TextCommand as an argument.
 * @param info Options for the decorator.
 */
export function role<T extends SlashCommand>(info: RoleArgOptions) {
    return (target: T, key: keyof T & string) => {
        arg({
            type: ApplicationCommandOptionType.Role,
            required: info.required,
            description: info.description,
            parser: new RoleParser(),
        })(target, key);
    };
}
