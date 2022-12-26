import { ApplicationCommandType, ChatInputApplicationCommandData } from "discord.js"
import { injectable } from "inversify"

import { getSlashCommandMeta } from "../../metadata"


export type CommandOptions =
    Omit<ChatInputApplicationCommandData, 'name' | 'type'>

/**
 * Marks a SlashCommand class as a command.
 * @param name The command's name.
 */
export function command(
    name: string,
    registrationDetails: CommandOptions,
) {
    return (target: any) => {
        const meta = getSlashCommandMeta(target)
        meta.name = name
        meta.registrationDetails = {
            ...registrationDetails,
            name,
            type: ApplicationCommandType.ChatInput,
        } as ChatInputApplicationCommandData
        meta.target = target
        return injectable()(target)
    }
}
