import { Constructable } from "@hades-ts/hades";
import { ApplicationCommandOptionType } from "discord.js";

import { arg } from "./arg";

export type ChannelArgOptions = {
    required?: boolean;
    description: string;
};
/**
 * Marks the field of a TextCommand as an argument.
 * @param info Options for the decorator.
 */
export function channel(info: ChannelArgOptions) {
    return (target: Constructable, key: string) => {
        arg({
            type: ApplicationCommandOptionType.Channel,
            required: info.required,
            description: info.description,
        })(target, key);
    };
}
