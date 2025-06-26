import {
    ApplicationCommandType,
    type ChatInputApplicationCommandData,
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
