import { Constructable } from "@hades-ts/hades";
import {
    type ApplicationCommandChannelOptionData,
    ApplicationCommandOptionType,
    type GuildBasedChannel,
} from "discord.js";

import { arg } from "./arg";
import { ChannelParser } from "../../parsers";
import type { SlashCommand } from "../../../models";
import { interfaces } from "inversify";
import { Validator, type Validators } from "../../../validators";
import type { Optional } from "../../../utils";

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
