import { injectable } from "inversify";

import {
  getSlashCommandMeta,
  SlashCommandRegistrationDetails,
} from "../metadata";


export type CommandOptions = 
  Omit<SlashCommandRegistrationDetails, 'name' | 'type'>

/**
 * Marks a SlashCommand class as a command.
 * @param name The command's name.
 */
export function command(
  name: string,
  registrationDetails: CommandOptions,
) {
  return (target: any) => {
    const meta = getSlashCommandMeta(target);
    meta.name = name;
    meta.registrationDetails = {
      ...registrationDetails,
      name,
      type: "CHAT_INPUT"
    } as SlashCommandRegistrationDetails;
    meta.target = target;
    return injectable()(target);
  };
}
