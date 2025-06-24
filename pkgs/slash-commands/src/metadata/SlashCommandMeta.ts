import { Newable } from "@hades-ts/hades";
import { ChatInputApplicationCommandData, Collection } from "discord.js";

import { SlashArgMeta } from "./SlashArgMeta";

/**
 * Decorator metadata for @command
 */
export class SlashCommandMeta {
    name: string;
    target: Newable;
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
