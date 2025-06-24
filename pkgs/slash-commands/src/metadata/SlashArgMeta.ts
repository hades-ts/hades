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
    parser?: SlashArgParser;
    description?: string;
    options?: ApplicationCommandOptionData;
    choicesResolver?: Constructor;
    choicesCompleter?: Constructor;
    validatorMethods = new Set<string>();
    validatorInstallers: InstallerFunc[] = [];
}
