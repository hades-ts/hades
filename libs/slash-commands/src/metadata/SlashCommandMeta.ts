import { ChatInputApplicationCommandData, Collection } from "discord.js";

import { Constructor } from "@hades-ts/hades";
import { SlashArgMeta } from "./SlashArgMeta";


/**
 * Decorator metadata for @command
 */
export class SlashCommandMeta {
  name: string;
  target: Constructor;
  args = new Collection<string, SlashArgMeta>();
  description?: string;
  registrationDetails?: ChatInputApplicationCommandData;

  getArgMeta(name: string) {
    let meta = this.args.get(name);
    if (meta === undefined) {
      meta = new SlashArgMeta();
      this.args.set(name, meta);
    }
    return meta;
  }
}
