import {
    ApplicationCommandType,
    type ChatInputApplicationCommandData,
    InteractionContextType,
} from "discord.js";
import { injectable, injectFromBase } from "inversify";

import { getSlashCommandMeta } from "../../metadata";

export type CommandOptions = Omit<
    ChatInputApplicationCommandData,
    "name" | "type"
>;

/**
 * Marks a SlashCommand class as a command.
 * @param name The command's name.
 */
export function command(name: string, registrationDetails: CommandOptions) {
    return (target: any) => {
        const meta = getSlashCommandMeta(target);
        meta.name = name;
        meta.description = registrationDetails.description ?? "";
        meta.registrationDetails = {
            ...registrationDetails,
            name,
            type: ApplicationCommandType.ChatInput,
        } as ChatInputApplicationCommandData;
        meta.target = target;
        injectable()(target);
        injectFromBase({
            extendConstructorArguments: false,
            extendProperties: true,
        })(target);
    };
}

export function guildCommand(
    name: string,
    registrationDetails: CommandOptions,
) {
    return (target: any) => {
        command(name, {
            ...registrationDetails,
            contexts: [InteractionContextType.Guild],
        })(target);
    };
}

export function botCommand(name: string, registrationDetails: CommandOptions) {
    return (target: any) => {
        command(name, {
            ...registrationDetails,
            contexts: [InteractionContextType.BotDM],
        })(target);
    };
}

export function privateCommand(
    name: string,
    registrationDetails: CommandOptions,
) {
    return (target: any) => {
        command(name, {
            ...registrationDetails,
            contexts: [InteractionContextType.PrivateChannel],
        })(target);
    };
}
