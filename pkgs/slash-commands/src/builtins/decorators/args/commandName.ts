import { ApplicationCommandOptionType } from "discord.js";
import { inject, injectable } from "inversify";

import type { Constructable } from "@hades-ts/core";

import { SlashCommandService } from "../../../services";
import { makeArgMeta } from "..";

export type ChannelNameArgOptions = {
    required?: boolean;
    description: string;
};

@injectable()
class CommandChoicesResolver {
    @inject(SlashCommandService)
    private slashCommandService!: SlashCommandService;

    getChoices() {
        return this.slashCommandService.factories
            .all()
            .map((f) => ({ name: f.meta.name, value: f.meta.name }));
    }
}

/**
 * Marks the field of a TextCommand as an argument.
 * @param info Options for the decorator.
 */
export function commandName(info: ChannelNameArgOptions) {
    return (target: Constructable, key: string) => {
        const meta = makeArgMeta(
            {
                type: ApplicationCommandOptionType.String,
                required: info.required,
                description: info.description,
            },
            target,
            key,
        );
        meta.choicesResolver = CommandChoicesResolver;
        inject(key)(target, key);
    };
}
