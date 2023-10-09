import { Constructable } from "@hades-ts/hades";
import { ApplicationCommandOptionType } from "discord.js";
import { arg } from "./arg";

export type RoleArgOptions = {
    required?: boolean;
    description: string;
};

/**
 * Marks the field of a TextCommand as an argument.
 * @param info Options for the decorator.
 */
export function role(info: RoleArgOptions) {
    return (target: Constructable, key: string) => {
        arg({
            type: ApplicationCommandOptionType.Role,
            required: info.required,
            description: info.description,
        })(target, key);
    };
}
