import { Constructable } from "@hades-ts/hades";
import { ApplicationCommandOptionType } from "discord.js";
import { arg } from "./arg";
import { RoleParser } from "../../parsers";
import type { SlashCommand } from "../../../models";

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
            parser: new RoleParser()
        })(target, key);
    };
}
