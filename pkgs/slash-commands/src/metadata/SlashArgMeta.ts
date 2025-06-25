import { type Constructor, type InstallerFunc, Newable } from "@hades-ts/hades";
import type { ApplicationCommandOptionData } from "discord.js";

import type { SlashArgParser } from "../services";
import type { interfaces } from "inversify";

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
    choicesResolver?: interfaces.Newable<any>;
    choicesCompleter?: interfaces.Newable<any>;
    validatorMethods = new Set<string>();
    validatorInstallers: InstallerFunc[] = [];
}
