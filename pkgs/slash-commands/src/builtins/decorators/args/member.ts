import { Constructable } from "@hades-ts/core";
import { ApplicationCommandOptionType, type GuildMember } from "discord.js";
import type { SlashCommand } from "../../../models";
import type { Validators } from "../../../validators";
import { MemberParser } from "../../parsers";
import { arg } from "./arg";

export type MemberArgOptions = {
    required?: boolean;
    description: string;
    validators?: Validators<GuildMember>;
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
            parser: new MemberParser(),
        })(target, key);
    };
}
