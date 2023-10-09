import { Constructor, InstallerFunc, Newable } from "@hades-ts/hades";
import { ApplicationCommandOptionData } from "discord.js";

import { SlashArgParser } from "../services";

/**
 * Decorator metdata for command arguments.
 */
export class SlashArgMeta {
    name?: string;
    type?: Constructor;
    property?: string;
    description?: string;
    options?: ApplicationCommandOptionData;
    choicesResolver?: Constructor;
    choicesCompleter?: Constructor;
    parserType?: Newable<SlashArgParser>;
    validatorMethods = new Set<string>();
    validatorInstallers: InstallerFunc[] = [];
}
