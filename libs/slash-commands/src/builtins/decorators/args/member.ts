import { Constructable } from "@hades-ts/hades";
import { ApplicationCommandOptionType } from "discord.js";

import { arg } from "./arg";
import { MemberParser } from "../../parsers";
import { SlashCommand } from "../../../models";

export type MemberArgOptions = {
    required?: boolean;
    description: string;
};

/**
 * Marks the field of a TextCommand as an argument.
 * @param info Options for the decorator.
 */
export function member<T extends SlashCommand>(info: MemberArgOptions) {
    return (target: T, key: keyof T & string) => {
        arg({
            type: ApplicationCommandOptionType.User,
            required: info.required,
            description: info.description,
            parser: new MemberParser()
        })(target, key);
    };
}
