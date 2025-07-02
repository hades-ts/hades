import type { ApplicationCommandOptionData } from "discord.js";
import type { Newable } from "inversify";

import type { Constructor, InstallerFunc } from "@hades-ts/core";

import type { SlashArgParser } from "../services";

/**
 * Decorator metdata for command arguments.
 */
export class SlashArgMeta {
    name!: string;
    type!: Constructor;
    property!: string;
    parser!: SlashArgParser;
    description!: string;
    options!: ApplicationCommandOptionData;
    choicesResolver?: Newable<any>;
    choicesCompleter?: Newable<any>;
    validatorMethods = new Set<string>();
    validatorInstallers: InstallerFunc[] = [];
}
