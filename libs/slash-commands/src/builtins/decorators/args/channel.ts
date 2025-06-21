import { Constructable } from "@hades-ts/hades";
import { ApplicationCommandChannelOptionData, ApplicationCommandOptionType, GuildBasedChannel } from "discord.js";

import { arg } from "./arg";
import { ChannelParser } from "../../parsers";
import { SlashCommand } from "../../../models";
import { interfaces } from "inversify";
import { Validator, Validators } from "../../../validators";
import { Optional } from "../../../utils";

export type ChannelArgOptions = {
    required?: boolean;
    description: string;
    validators?: Validators<GuildBasedChannel>;
} & Optional<ApplicationCommandChannelOptionData, "name" | "type">;
/**
 * Marks the field of a TextCommand as an argument.
 * @param info Options for the decorator.
 */
export function channel<T extends SlashCommand>(info: ChannelArgOptions) {
    return (target: T, key: keyof T & string) => {
        arg<GuildBasedChannel>({
            type: ApplicationCommandOptionType.Channel,
            required: info.required === undefined ? true : info.required,
            description: info.description,
            parser: new ChannelParser(),
            validators: info.validators,
        })(target, key);
    };
}
