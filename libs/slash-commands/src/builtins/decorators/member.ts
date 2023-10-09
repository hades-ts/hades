import { Constructable } from "@hades-ts/hades";
import { ApplicationCommandOptionType } from "discord.js";

import { arg } from "./arg";

export type MemberArgOptions = {
    required?: boolean;
    description: string;
};

/**
 * Marks the field of a TextCommand as an argument.
 * @param info Options for the decorator.
 */
export function member(info: MemberArgOptions) {
    return (target: Constructable, key: string) => {
        arg({
            type: ApplicationCommandOptionType.User,
            required: info.required,
            description: info.description,
        })(target, key);
    };
}
